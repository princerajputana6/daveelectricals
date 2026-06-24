# Accreditation logos

The "Qualified, registered & certified" scrolling strip (on the Home and
Services pages) loads each logo from this folder. These 8 files are wired up:

| Filename                               | Logo                        |
| -------------------------------------- | --------------------------- |
| `napit.jpeg`                           | NAPIT                       |
| `ukas.jpeg`                            | UKAS                        |
| `trustmark.jpeg`                       | TrustMark                   |
| `eal.jpeg`                             | EAL Recognised Partner      |
| `city-and-guilds.jpeg`                 | City & Guilds (Level 3)     |
| `fia.jpeg`                             | Fire Industry Association   |
| `part-p.jpeg`                          | Part P Registered Installer |
| `registered-competent-person.jpeg`     | Registered Competent Person |

To replace a logo, keep the same filename (or update the matching `src` in the
`accreditations` array in `lib/content.ts`). The strip is fully data-driven from
there — edit that array to add or remove logos.
