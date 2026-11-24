// Om introduksjonssiden er vist (FR-27, AD-10, AD-13). ui/ kan ikke bruke lagring/ direkte,
// så rutingen spør her.

import { lagreIntroSett, lesIntroSett } from '../lagring/lagrede-kjoringer.ts'

export function harSettIntroduksjonen(): boolean {
  return lesIntroSett()
}

export function merkIntroduksjonenSomSett(): void {
  lagreIntroSett()
}
