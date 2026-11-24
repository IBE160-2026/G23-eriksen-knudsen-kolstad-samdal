// Setter lys eller mørk visning før siden tegnes første gang, så den ikke blinker i feil visning (Story 1.13, AD-1, AD-10).
// Ligger her og ikke i src/ fordi den må kjøre i <head> før stilarket tegnes, og CSP-en tillater ikke inline-skript.
// Samme nøkkel som NOKKEL_VISNING i src/lagring/lagrede-kjoringer.ts. Mangler nøkkelen eller lagringen er blokkert, er visningen lys.
try {
  if (localStorage.getItem('cosi-mrp:visning') === 'mork') {
    document.documentElement.setAttribute('data-visning', 'mork')
  }
} catch {
  // Blokkert lagring: visningen er lys til Kari bytter.
}
