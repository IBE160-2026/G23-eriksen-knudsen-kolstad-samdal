// Ruller cellen med fokus inn i bildet (Story 2.9, WCAG 2.4.11, EXPERIENCE.md › Resultattabell: rulling og ytelse).
// Cellen skal aldri skjules bak de faste lagene: ukeoverskriften og venstrekolonnene i tabellområdet, og kjøringslinjen
// øverst på siden. `scrollIntoView` kjenner ikke igjen sticky-lagene (og ruller alle forfedre), så rullingen regnes ut her.
// Rullingen er alltid et hopp uten bevegelse, så `prefers-reduced-motion` er oppfylt.

/** Luften mellom cellen og kanten av det faste laget, i px. */
const LUFT = 4

export function rullInnIBildet(celle: HTMLElement, omraade: HTMLElement): void {
  const ramme = omraade.getBoundingClientRect()

  // Inne i området: under ukeoverskriften, og for ukecellene til høyre for de faste venstrekolonnene.
  // Radnavnet og delens felt er selv faste til venstre, så de rulles bare loddrett.
  const oppe = omraade.querySelector('thead')?.getBoundingClientRect().height ?? 0
  const venstre = celle.dataset.k !== undefined && Number(celle.dataset.k) >= 2
    ? (omraade.querySelector('.tabellhjorne')?.getBoundingClientRect().width ?? 0)
    : 0
  const celleRamme = celle.getBoundingClientRect()
  const toppKant = ramme.top + oppe + LUFT
  if (celleRamme.top < toppKant) omraade.scrollTop -= toppKant - celleRamme.top
  else if (celleRamme.bottom > ramme.bottom - LUFT) omraade.scrollTop += celleRamme.bottom - (ramme.bottom - LUFT)
  if (venstre > 0) {
    const venstreKant = ramme.left + venstre + LUFT
    if (celleRamme.left < venstreKant) omraade.scrollLeft -= venstreKant - celleRamme.left
    else if (celleRamme.right > ramme.right - LUFT) omraade.scrollLeft += celleRamme.right - (ramme.right - LUFT)
  }

  // På siden: under kjøringslinjen, som står fast øverst, og over nederkanten av vinduet.
  const linje = document.querySelector('.kjoringslinje')?.getBoundingClientRect().bottom ?? 0
  const etterRulling = celle.getBoundingClientRect()
  const sideToppKant = linje + LUFT
  if (etterRulling.top < sideToppKant) window.scrollBy(0, etterRulling.top - sideToppKant)
  else if (etterRulling.bottom > window.innerHeight - LUFT) window.scrollBy(0, etterRulling.bottom - (window.innerHeight - LUFT))
}

/**
 * Ruller tabellen til en del etter et hopp fra kritiske deler (Story 2.10): delen øverst i området rett under
 * ukeoverskriften, og området rett under kjøringslinjen, så Kari ser delen uten å rulle mer. Cellen som får fokus,
 * rulles bort fra de faste lagene etterpå med `rullInnIBildet`.
 */
export function rullTilDel(del: HTMLElement, omraade: HTMLElement): void {
  const oppe = omraade.querySelector('thead')?.getBoundingClientRect().height ?? 0
  omraade.scrollTop += del.getBoundingClientRect().top - (omraade.getBoundingClientRect().top + oppe + LUFT)
  const linje = document.querySelector('.kjoringslinje')?.getBoundingClientRect().bottom ?? 0
  window.scrollBy(0, omraade.getBoundingClientRect().top - (linje + LUFT))
}
