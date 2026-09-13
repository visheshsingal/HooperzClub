export function generateBasketballFixtures(teamCount = 8, tournamentType = 'Knockout', existingTeams = []) {
  const count = Number(teamCount) || 8;
  const teams = Array.from({ length: count }, (_, i) => existingTeams[i] || `Team ${i + 1}`);

  if (tournamentType === 'Round Robin') {
    const matches = [];
    let matchCounter = 1;
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matches.push({
          id: `rr-${matchCounter}`,
          round: `Group Match ${matchCounter}`,
          roundIndex: 1,
          matchNumber: matchCounter,
          teamA: teams[i],
          teamB: teams[j],
          scoreA: 0,
          scoreB: 0,
          winner: null,
          status: 'Scheduled',
        });
        matchCounter++;
      }
    }
    return matches;
  }

  // Knockout Single Elimination Bracket
  // Supported standard team counts: 4, 8, 16, 32
  let numTeams = 4;
  if (count > 16) numTeams = 32;
  else if (count > 8) numTeams = 16;
  else if (count > 4) numTeams = 8;
  else numTeams = 4;

  const paddedTeams = Array.from({ length: numTeams }, (_, i) => teams[i] || `Team ${i + 1}`);
  const totalRounds = Math.log2(numTeams);

  const rounds = [];
  let currentRoundMatches = numTeams / 2;
  let matchIdCounter = 1;

  for (let r = 1; r <= totalRounds; r++) {
    let roundName = `Round ${r}`;
    if (r === totalRounds) roundName = 'Finals';
    else if (r === totalRounds - 1) roundName = 'Semifinals';
    else if (r === totalRounds - 2) roundName = 'Quarterfinals';

    const roundMatches = [];
    for (let m = 0; m < currentRoundMatches; m++) {
      const matchId = `m-${matchIdCounter++}`;
      let teamA = 'TBD';
      let teamB = 'TBD';

      if (r === 1) {
        teamA = paddedTeams[m * 2];
        teamB = paddedTeams[m * 2 + 1];
      }

      roundMatches.push({
        id: matchId,
        round: roundName,
        roundIndex: r,
        matchNumber: m + 1,
        teamA,
        teamB,
        scoreA: 0,
        scoreB: 0,
        winner: null,
        status: 'Scheduled',
        nextMatchId: null,
        nextMatchSlot: null,
      });
    }
    rounds.push(roundMatches);
    currentRoundMatches = currentRoundMatches / 2;
  }

  // Connect matches to next round slots
  for (let r = 0; r < rounds.length - 1; r++) {
    const currentRound = rounds[r];
    const nextRound = rounds[r + 1];
    for (let i = 0; i < currentRound.length; i++) {
      const nextMatchIndex = Math.floor(i / 2);
      const slot = i % 2 === 0 ? 'teamA' : 'teamB';
      currentRound[i].nextMatchId = nextRound[nextMatchIndex].id;
      currentRound[i].nextMatchSlot = slot;
    }
  }

  return rounds.flat();
}
