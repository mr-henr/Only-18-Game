/** Utilidades compartilhadas pelo servidor. */

/** Segundos pedidos pela carta em jogo, se ela pedir tempo. */
export function durationSecondsOf(play) {
  for (const value of Object.values(play?.values ?? {})) {
    if (value && typeof value.seconds === 'number') return value.seconds;
  }
  return null;
}
