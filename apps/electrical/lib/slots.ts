import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

/**
 * Same-day emergency booking slots (WEB changes V1.1 — Sr No 21).
 *
 * Admin opens time slots per date. A customer books one open slot and pays in
 * full; the slot is atomically claimed (open → booked) so it can never be
 * double-booked. Booked / closed slots show as "Not available" to everyone else.
 */

export type SlotStatus = "open" | "booked" | "closed";

export type Slot = {
  _id: ObjectId;
  date: string; // yyyy-mm-dd (local)
  time: string; // HH:mm (24h)
  status: SlotStatus;
  orderId?: string;
  bookedBy?: string;
  createdAt: Date;
  updatedAt: Date;
};

let indexReady = false;

export async function slotsCol() {
  const db = await getDb();
  const col = db.collection<Slot>("slots");
  if (!indexReady) {
    // One slot per date+time.
    await col.createIndex({ date: 1, time: 1 }, { unique: true }).catch(() => {});
    indexReady = true;
  }
  return col;
}

export function publicSlot(s: Slot) {
  return {
    id: s._id.toString(),
    date: s.date,
    time: s.time,
    status: s.status,
    booked: s.status !== "open",
  };
}

/** Today's date as local yyyy-mm-dd. */
export function todayISO() {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

/**
 * Atomically claim an open slot for an order. Returns the updated slot, or null
 * if the slot no longer exists / is already taken (prevents double-booking).
 */
export async function claimSlot(
  slotId: string,
  orderId: string,
  userId: string,
) {
  if (!ObjectId.isValid(slotId)) return null;
  const col = await slotsCol();
  const now = new Date();
  const res = await col.findOneAndUpdate(
    { _id: new ObjectId(slotId), status: "open" },
    {
      $set: {
        status: "booked" as SlotStatus,
        orderId,
        bookedBy: userId,
        updatedAt: now,
      },
    },
    { returnDocument: "after" },
  );
  return res ?? null;
}

/** Release a previously-claimed slot back to open (e.g. cancelled booking). */
export async function releaseSlot(slotId: string) {
  if (!ObjectId.isValid(slotId)) return;
  const col = await slotsCol();
  await col.updateOne(
    { _id: new ObjectId(slotId), status: "booked" },
    { $set: { status: "open" as SlotStatus, updatedAt: new Date() }, $unset: { orderId: "", bookedBy: "" } },
  );
}
