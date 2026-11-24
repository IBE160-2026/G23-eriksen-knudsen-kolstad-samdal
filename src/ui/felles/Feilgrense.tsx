// Feilgrensen rundt visningene (AD-5). Kaster en visning under tegning, vises en norsk
// reservemelding med lenke til Ny kjøring, og appmenyen står. Grensen nullstilles når
// ruten endres, uten at siden lastes på nytt.

import { Component, type ErrorInfo, type ReactNode } from 'react'
import { felles } from '../../tekster/nb.ts'

type Props = {
  /** Ruten som vises. Når den endres, nullstilles grensen. */
  nokkel: string
  children?: ReactNode
}

type State = { nokkel: string; harFeil: boolean }

/** Ruten lenken i reservemeldingen går til. */
const NY_KJORING_RUTE = 'ny-kjoring'
const NY_KJORING = `#/${NY_KJORING_RUTE}`

export class Feilgrense extends Component<Props, State> {
  state: State = { nokkel: this.props.nokkel, harFeil: false }

  static getDerivedStateFromError(): Partial<State> {
    return { harFeil: true }
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    return props.nokkel !== state.nokkel ? { nokkel: props.nokkel, harFeil: false } : null
  }

  // Årsaken skal kunne finnes i konsollen, med komponentstakken (AD-5). React 19 logger også selve
  // feilen én gang (onCaughtError), men uten komponentstakken.
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info)
  }

  // Står grensen allerede på Ny kjøring, endrer ikke klikket adressen, og ingen ruteskifte nullstiller
  // grensen. Da nullstilles den her. Fra en annen rute gjør ruteskiftet det, og en nullstilling her ville
  // tegnet den feilende visningen én gang til før ruten skifter.
  private provIgjen = () => {
    if (this.state.nokkel === NY_KJORING_RUTE) this.setState({ harFeil: false })
  }

  // Fokus flyttes til h1 bare når grensen skifter uten ruteskifte (en visning kaster, eller lenken
  // nullstiller den). Ved ruteskifte flytter Skall i App.tsx fokus, så det skjer bare én gang.
  componentDidUpdate(_: Props, forrige: State) {
    if (forrige.nokkel !== this.state.nokkel) return
    if (forrige.harFeil === this.state.harFeil || typeof document === 'undefined') return
    document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true })
  }

  render() {
    if (!this.state.harFeil) return this.props.children
    return <Reservemelding vedKlikk={this.provIgjen} />
  }
}

export function Reservemelding({ vedKlikk }: { vedKlikk?: () => void }) {
  return (
    <section className="visning">
      <title>{felles.sidetittel(felles.feilgrense.overskrift)}</title>
      <h1 tabIndex={-1}>{felles.feilgrense.overskrift}</h1>
      <div className="informasjonsboks">
        <p>{felles.feilgrense.tekst}</p>
        <p>
          <a href={NY_KJORING} onClick={vedKlikk}>
            {felles.tilNyKjoring}
          </a>
        </p>
      </div>
    </section>
  )
}
