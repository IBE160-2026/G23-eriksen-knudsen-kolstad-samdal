// Feilgrensen rundt visningene (AD-5). Kaster en visning under tegning, vises en norsk
// reservemelding med lenke til Ny kjøring, og appmenyen står. Grensen nullstilles når
// ruten endres, uten at siden lastes på nytt.

import { Component, type ReactNode } from 'react'
import { felles } from '../../tekster/nb.ts'

type Props = {
  /** Ruten som vises. Når den endres, nullstilles grensen. */
  nokkel: string
  children?: ReactNode
}

type State = { nokkel: string; harFeil: boolean }

const NY_KJORING = '#/ny-kjoring'

export class Feilgrense extends Component<Props, State> {
  state: State = { nokkel: this.props.nokkel, harFeil: false }

  static getDerivedStateFromError(): Partial<State> {
    return { harFeil: true }
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    return props.nokkel !== state.nokkel ? { nokkel: props.nokkel, harFeil: false } : null
  }

  // Står brukeren allerede på Ny kjøring, endres ikke adressen ved klikk. Da nullstilles grensen her.
  private provIgjen = () => {
    if (window.location.hash === NY_KJORING) this.setState({ harFeil: false })
  }

  // Skifter grensen uten ruteskifte (en visning kaster, eller lenken nullstiller den), flytter ikke
  // App.tsx fokus. Da settes fokus på h1 her, så tastatur- og skjermleserbrukere ikke mister plassen.
  componentDidUpdate(_: Props, forrige: State) {
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
