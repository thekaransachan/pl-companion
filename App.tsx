
import React, { useState, useEffect } from 'react';
import Header from './Header';
import MatchweekFixtures from './MatchweekFixtures';
import LeagueTableSnippet from './LeagueTableSnippet';
import Sidebar from './Sidebar';
import FplStats from './FplStats';

// --- Type Definitions ---
export interface Team {
  name: string;
  id: string;
  shortName: string;
  abbr?: string;
}

export interface Match {
  kickoffTimezone: string;
  period: string;
  kickoff: string;
  awayTeam: Team;
  homeTeam: Team;
  competition: string;
  ground: string;
  matchId: string;
}

export interface Stats {
  goalsFor: number;
  lost: number;
  won: number;
  position: number;
  drawn: number;
  goalsAgainst: number;
  played: number;
  points: number;
  startingPosition?: number;
}

export interface TableEntry {
  away: Stats;
  overall: Stats;
  team: Team;
  home: Stats;
}

// --- Sample Data (Fallback) ---
const sampleFixturesData = {
    "data": [
        { "kickoffTimezone": "GMT", "period": "PreMatch", "kickoff": "2025-11-22 15:00:00", "awayTeam": { "name": "West Ham United", "id": "21", "shortName": "West Ham" }, "homeTeam": { "name": "Bournemouth", "id": "91", "shortName": "Bournemouth" }, "competition": "Premier League", "ground": "Vitality Stadium, Bournemouth", "matchId": "2562005" },
        { "kickoffTimezone": "GMT", "period": "PreMatch", "kickoff": "2025-11-23 16:30:00", "awayTeam": { "name": "Tottenham Hotspur", "id": "6", "shortName": "Spurs" }, "homeTeam": { "name": "Arsenal", "id": "3", "shortName": "Arsenal" }, "competition": "Premier League", "ground": "Emirates Stadium, London", "matchId": "2562006" },
        { "kickoffTimezone": "GMT", "period": "PreMatch", "kickoff": "2025-11-22 15:00:00", "awayTeam": { "name": "Brentford", "id": "94", "shortName": "Brentford" }, "homeTeam": { "name": "Brighton and Hove Albion", "id": "36", "shortName": "Brighton" }, "competition": "Premier League", "ground": "American Express Stadium, Falmer", "matchId": "2562007" },
        { "kickoffTimezone": "GMT", "period": "PreMatch", "kickoff": "2025-11-22 12:30:00", "awayTeam": { "name": "Chelsea", "id": "8", "shortName": "Chelsea" }, "homeTeam": { "name": "Burnley", "id": "90", "shortName": "Burnley" }, "competition": "Premier League", "ground": "Turf Moor, Burnley", "matchId": "2562008" },
        { "kickoffTimezone": "GMT", "period": "PreMatch", "kickoff": "2025-11-22 15:00:00", "awayTeam": { "name": "Sunderland", "id": "56", "shortName": "Sunderland" }, "homeTeam": { "name": "Fulham", "id": "54", "shortName": "Fulham" }, "competition": "Premier League", "ground": "Craven Cottage, London", "matchId": "2562009" },
        { "kickoffTimezone": "GMT", "period": "PreMatch", "kickoff": "2025-11-23 14:00:00", "awayTeam": { "name": "Aston Villa", "id": "7", "shortName": "Aston Villa" }, "homeTeam": { "name": "Leeds United", "id": "2", "shortName": "Leeds" }, "competition": "Premier League", "ground": "Elland Road, Leeds", "matchId": "2562010" },
        { "kickoffTimezone": "GMT", "period": "PreMatch", "kickoff": "2025-11-22 15:00:00", "awayTeam": { "name": "Nottingham Forest", "id": "17", "shortName": "Nott'm Forest" }, "homeTeam": { "name": "Liverpool", "id": "14", "shortName": "Liverpool" }, "competition": "Premier League", "ground": "Anfield, Liverpool", "matchId": "2562011" },
        { "kickoffTimezone": "GMT", "period": "PreMatch", "kickoff": "2025-11-24 20:00:00", "awayTeam": { "name": "Everton", "id": "11", "shortName": "Everton" }, "homeTeam": { "name": "Manchester United", "id": "1", "shortName": "Man Utd" }, "competition": "Premier League", "ground": "Old Trafford, Manchester", "matchId": "2562012" },
        { "kickoffTimezone": "GMT", "period": "PreMatch", "kickoff": "2025-11-22 17:30:00", "awayTeam": { "name": "Manchester City", "id": "43", "shortName": "Man City" }, "homeTeam": { "name": "Newcastle United", "id": "4", "shortName": "Newcastle" }, "competition": "Premier League", "ground": "St. James' Park, Newcastle", "matchId": "2562013" },
        { "kickoffTimezone": "GMT", "period": "PreMatch", "kickoff": "2025-11-22 15:00:00", "awayTeam": { "name": "Crystal Palace", "id": "31", "shortName": "Crystal Palace" }, "homeTeam": { "name": "Wolverhampton Wanderers", "id": "39", "shortName": "Wolves" }, "competition": "Premier League", "ground": "Molineux Stadium, Wolverhampton", "matchId": "2562014" }
    ]
};
const sampleTableData = { "matchweek": 11, "tables": [{ "entries": [ { "away": { "goalsFor": 8, "lost": 1, "won": 4, "position": 2, "drawn": 1, "goalsAgainst": 4, "played": 6, "points": 13 }, "overall": { "goalsFor": 20, "lost": 1, "won": 8, "position": 1, "drawn": 2, "goalsAgainst": 5, "startingPosition": 1, "played": 11, "points": 26 }, "team": { "name": "Arsenal", "id": "3", "shortName": "Arsenal", "abbr": "ARS" }, "home": { "goalsFor": 12, "lost": 0, "won": 4, "position": 2, "drawn": 1, "goalsAgainst": 1, "played": 5, "points": 13 } }, { "away": { "goalsFor": 7, "lost": 2, "won": 2, "position": 4, "drawn": 1, "goalsAgainst": 4, "played": 5, "points": 7 }, "overall": { "goalsFor": 23, "lost": 3, "won": 7, "position": 2, "drawn": 1, "goalsAgainst": 8, "startingPosition": 2, "played": 11, "points": 22 }, "team": { "name": "Manchester City", "id": "43", "shortName": "Man City", "abbr": "MCI" }, "home": { "goalsFor": 16, "lost": 1, "won": 5, "position": 1, "drawn": 0, "goalsAgainst": 4, "played": 6, "points": 15 } }, { "away": { "goalsFor": 12, "lost": 1, "won": 3, "position": 3, "drawn": 1, "goalsAgainst": 5, "played": 5, "points": 10 }, "overall": { "goalsFor": 21, "lost": 3, "won": 6, "position": 3, "drawn": 2, "goalsAgainst": 11, "startingPosition": 7, "played": 11, "points": 20 }, "team": { "name": "Chelsea", "id": "8", "shortName": "Chelsea", "abbr": "CHE" }, "home": { "goalsFor": 9, "lost": 2, "won": 3, "position": 12, "drawn": 1, "goalsAgainst": 6, "played": 6, "points": 10 } }, { "away": { "goalsFor": 3, "lost": 2, "won": 2, "position": 6, "drawn": 1, "goalsAgainst": 5, "played": 5, "points": 7 }, "overall": { "goalsFor": 14, "lost": 2, "won": 5, "position": 4, "drawn": 4, "goalsAgainst": 10, "startingPosition": 4, "played": 11, "points": 19 }, "team": { "name": "Sunderland", "id": "56", "shortName": "Sunderland", "abbr": "SUN" }, "home": { "goalsFor": 11, "lost": 0, "won": 3, "position": 6, "drawn": 3, "goalsAgainst": 5, "played": 6, "points": 12 } }, { "away": { "goalsFor": 12, "lost": 0, "won": 4, "position": 1, "drawn": 1, "goalsAgainst": 3, "played": 5, "points": 13 }, "overall": { "goalsFor": 19, "lost": 3, "won": 5, "position": 5, "drawn": 3, "goalsAgainst": 10, "startingPosition": 6, "played": 11, "points": 18 }, "team": { "name": "Tottenham Hotspur", "id": "6", "shortName": "Spurs", "abbr": "TOT" }, "home": { "goalsFor": 7, "lost": 3, "won": 1, "position": 19, "drawn": 2, "goalsAgainst": 7, "played": 6, "points": 5 } }, { "away": { "goalsFor": 3, "lost": 2, "won": 1, "position": 9, "drawn": 2, "goalsAgainst": 5, "played": 5, "points": 5 }, "overall": { "goalsFor": 13, "lost": 3, "won": 5, "position": 6, "drawn": 3, "goalsAgainst": 10, "startingPosition": 11, "played": 11, "points": 18 }, "team": { "name": "Aston Villa", "id": "7", "shortName": "Aston Villa", "abbr": "AVL" }, "home": { "goalsFor": 10, "lost": 1, "won": 4, "position": 5, "drawn": 1, "goalsAgainst": 5, "played": 6, "points": 13 } }, { "away": { "goalsFor": 8, "lost": 2, "won": 1, "position": 8, "drawn": 3, "goalsAgainst": 12, "played": 6, "points": 6 }, "overall": { "goalsFor": 19, "lost": 3, "won": 5, "position": 7, "drawn": 3, "goalsAgainst": 18, "startingPosition": 8, "played": 11, "points": 18 }, "team": { "name": "Manchester United", "id": "1", "shortName": "Man Utd", "abbr": "MUN" }, "home": { "goalsFor": 11, "lost": 1, "won": 4, "position": 7, "drawn": 0, "goalsAgainst": 6, "played": 5, "points": 12 } }, { "away": { "goalsFor": 8, "lost": 4, "won": 2, "position": 7, "drawn": 0, "goalsAgainst": 12, "played": 6, "points": 6 }, "overall": { "goalsFor": 18, "lost": 5, "won": 6, "position": 8, "drawn": 0, "goalsAgainst": 17, "startingPosition": 3, "played": 11, "points": 18 }, "team": { "name": "Liverpool", "id": "14", "shortName": "Liverpool", "abbr": "LIV" }, "home": { "goalsFor": 10, "lost": 1, "won": 4, "position": 8, "drawn": 0, "goalsAgainst": 5, "played": 5, "points": 12 } }, { "away": { "goalsFor": 9, "lost": 3, "won": 1, "position": 11, "drawn": 2, "goalsAgainst": 16, "played": 6, "points": 5 }, "overall": { "goalsFor": 17, "lost": 3, "won": 5, "position": 9, "drawn": 3, "goalsAgainst": 18, "startingPosition": 5, "played": 11, "points": 18 }, "team": { "name": "Bournemouth", "id": "91", "shortName": "Bournemouth", "abbr": "BOU" }, "home": { "goalsFor": 8, "lost": 0, "won": 4, "position": 3, "drawn": 1, "goalsAgainst": 2, "played": 5, "points": 13 } }, { "away": { "goalsFor": 6, "lost": 2, "won": 2, "position": 5, "drawn": 1, "goalsAgainst": 4, "played": 5, "points": 7 }, "overall": { "goalsFor": 14, "lost": 2, "won": 4, "position": 10, "drawn": 5, "goalsAgainst": 9, "startingPosition": 9, "played": 11, "points": 17 }, "team": { "name": "Crystal Palace", "id": "31", "shortName": "Crystal Palace", "abbr": "CRY" }, "home": { "goalsFor": 8, "lost": 0, "won": 2, "position": 13, "drawn": 4, "goalsAgainst": 5, "played": 6, "points": 10 } }, { "away": { "goalsFor": 7, "lost": 3, "won": 1, "position": 10, "drawn": 2, "goalsAgainst": 10, "played": 6, "points": 5 }, "overall": { "goalsFor": 17, "lost": 3, "won": 4, "position": 11, "drawn": 4, "goalsAgainst": 15, "startingPosition": 10, "played": 11, "points": 16 }, "team": { "name": "Brighton and Hove Albion", "id": "36", "shortName": "Brighton", "abbr": "BHA" }, "home": { "goalsFor": 10, "lost": 0, "won": 3, "position": 9, "drawn": 2, "goalsAgainst": 5, "played": 5, "points": 11 } }, { "away": { "goalsFor": 5, "lost": 4, "won": 1, "position": 14, "drawn": 0, "goalsAgainst": 10, "played": 5, "points": 3 }, "overall": { "goalsFor": 17, "lost": 5, "won": 5, "position": 12, "drawn": 1, "goalsAgainst": 17, "startingPosition": 12, "played": 11, "points": 16 }, "team": { "name": "Brentford", "id": "94", "shortName": "Brentford", "abbr": "BRE" }, "home": { "goalsFor": 12, "lost": 1, "won": 4, "position": 4, "drawn": 1, "goalsAgainst": 7, "played": 6, "points": 13 } }, { "away": { "goalsFor": 5, "lost": 3, "won": 1, "position": 12, "drawn": 1, "goalsAgainst": 8, "played": 5, "points": 4 }, "overall": { "goalsFor": 12, "lost": 4, "won": 4, "position": 13, "drawn": 3, "goalsAgainst": 13, "startingPosition": 14, "played": 11, "points": 15 }, "team": { "name": "Everton", "id": "11", "shortName": "Everton", "abbr": "EVE" }, "home": { "goalsFor": 7, "lost": 1, "won": 3, "position": 10, "drawn": 2, "goalsAgainst": 5, "played": 6, "points": 11 } }, { "away": { "goalsFor": 3, "lost": 3, "won": 0, "position": 15, "drawn": 3, "goalsAgainst": 8, "played": 6, "points": 3 }, "overall": { "goalsFor": 11, "lost": 5, "won": 3, "position": 14, "drawn": 3, "goalsAgainst": 14, "startingPosition": 13, "played": 11, "points": 12 }, "team": { "name": "Newcastle United", "id": "4", "shortName": "Newcastle", "abbr": "NEW" }, "home": { "goalsFor": 8, "lost": 2, "won": 3, "position": 14, "drawn": 0, "goalsAgainst": 6, "played": 5, "points": 9 } }, { "away": { "goalsFor": 4, "lost": 5, "won": 0, "position": 19, "drawn": 1, "goalsAgainst": 13, "played": 6, "points": 1 }, "overall": { "goalsFor": 12, "lost": 6, "won": 3, "position": 15, "drawn": 2, "goalsAgainst": 16, "startingPosition": 15, "played": 11, "points": 11 }, "team": { "name": "Fulham", "id": "54", "shortName": "Fulham", "abbr": "FUL" }, "home": { "goalsFor": 8, "lost": 1, "won": 3, "position": 11, "drawn": 1, "goalsAgainst": 3, "played": 5, "points": 10 } }, { "away": { "goalsFor": 4, "lost": 5, "won": 1, "position": 17, "drawn": 0, "goalsAgainst": 15, "played": 6, "points": 3 }, "overall": { "goalsFor": 10, "lost": 6, "won": 3, "position": 16, "drawn": 2, "goalsAgainst": 20, "startingPosition": 16, "played": 11, "points": 11 }, "team": { "name": "Leeds United", "id": "2", "shortName": "Leeds", "abbr": "LEE" }, "home": { "goalsFor": 6, "lost": 1, "won": 2, "position": 15, "drawn": 2, "goalsAgainst": 5, "played": 5, "points": 8 } }, { "away": { "goalsFor": 9, "lost": 5, "won": 1, "position": 16, "drawn": 0, "goalsAgainst": 18, "played": 6, "points": 3 }, "overall": { "goalsFor": 14, "lost": 7, "won": 3, "position": 17, "drawn": 1, "goalsAgainst": 22, "startingPosition": 17, "played": 11, "points": 10 }, "team": { "name": "Burnley", "id": "90", "shortName": "Burnley", "abbr": "BUR" }, "home": { "goalsFor": 5, "lost": 2, "won": 2, "position": 16, "drawn": 1, "goalsAgainst": 4, "played": 5, "points": 7 } }, { "away": { "goalsFor": 5, "lost": 3, "won": 1, "position": 13, "drawn": 1, "goalsAgainst": 8, "played": 5, "points": 4 }, "overall": { "goalsFor": 13, "lost": 7, "won": 3, "position": 18, "drawn": 1, "goalsAgainst": 23, "startingPosition": 18, "played": 11, "points": 10 }, "team": { "name": "West Ham United", "id": "21", "shortName": "West Ham", "abbr": "WHU" }, "home": { "goalsFor": 8, "lost": 4, "won": 2, "position": 18, "drawn": 0, "goalsAgainst": 15, "played": 6, "points": 6 } }, { "away": { "goalsFor": 2, "lost": 3, "won": 0, "position": 18, "drawn": 2, "goalsAgainst": 9, "played": 5, "points": 2 }, "overall": { "goalsFor": 10, "lost": 6, "won": 2, "position": 19, "drawn": 3, "goalsAgainst": 20, "startingPosition": 19, "played": 11, "points": 9 }, "team": { "name": "Nottingham Forest", "id": "17", "shortName": "Nott'm Forest", "abbr": "NFO" }, "home": { "goalsFor": 8, "lost": 3, "won": 2, "position": 17, "drawn": 1, "goalsAgainst": 11, "played": 6, "points": 7 } }, { "away": { "goalsFor": 1, "lost": 5, "won": 0, "position": 20, "drawn": 1, "goalsAgainst": 11, "played": 6, "points": 1 }, "overall": { "goalsFor": 7, "lost": 9, "won": 0, "position": 20, "drawn": 2, "goalsAgainst": 25, "startingPosition": 20, "played": 11, "points": 2 }, "team": { "name": "Wolverhampton Wanderers", "id": "39", "shortName": "Wolves", "abbr": "WOL" }, "home": { "goalsFor": 6, "lost": 4, "won": 0, "position": 20, "drawn": 1, "goalsAgainst": 14, "played": 5, "points": 1 } } ] }] };

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [table, setTable] = useState<TableEntry[]>([]);
  const [matchweek, setMatchweek] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      const season = 624; // 2024/25 season ID
      const currentGameweek = 1;

      try {
        const [matchesResponse, tableResponse] = await Promise.all([
          fetch(`https://footballapi.pulselive.com/football/fixtures?comps=1&compSeasons=${season}&gameweeks=${currentGameweek}&page=0&pageSize=10`),
          fetch(`https://footballapi.pulselive.com/football/competitions/1/compseasons/${season}/standings/ranked`)
        ]);

        if (!matchesResponse.ok) throw new Error('Failed to fetch matches');
        if (!tableResponse.ok) throw new Error('Failed to fetch table');

        const matchesData = await matchesResponse.json();
        const tableData = await tableResponse.json();
        
        const mappedMatches = matchesData.content.map((match: any): Match => ({
            matchId: match.id.toString(),
            kickoff: match.kickoff.label,
            homeTeam: {
                id: match.teams[0].team.club.id.toString(),
                name: match.teams[0].team.name,
                shortName: match.teams[0].team.club.shortName,
                abbr: match.teams[0].team.club.abbr,
            },
            awayTeam: {
                id: match.teams[1].team.club.id.toString(),
                name: match.teams[1].team.name,
                shortName: match.teams[1].team.club.shortName,
                abbr: match.teams[1].team.club.abbr,
            },
            ground: match.ground.name,
            kickoffTimezone: match.kickoff.label.split(' ').pop(),
            period: 'PreMatch',
            competition: 'Premier League',
        }));

        const dummyStats: Stats = { goalsFor: 0, lost: 0, won: 0, position: 0, drawn: 0, goalsAgainst: 0, played: 0, points: 0 };
        const mappedTable = tableData.tables[0].entries.map((entry: any): TableEntry => ({
            team: {
                id: entry.team.club.id.toString(),
                name: entry.team.name,
                shortName: entry.team.club.shortName,
                abbr: entry.team.club.abbr,
            },
            overall: {
                position: entry.position,
                played: entry.played,
                won: entry.won,
                drawn: entry.drawn,
                lost: entry.lost,
                goalsFor: entry.goalsFor,
                goalsAgainst: entry.goalsAgainst,
                points: entry.points,
            },
            home: dummyStats,
            away: dummyStats,
        }));

        setMatches(mappedMatches);
        setTable(mappedTable);
        setMatchweek(currentGameweek);

      } catch (e) {
        console.error("Failed to fetch live data, using sample data as fallback.", e);
        setError('Could not fetch live data. Displaying sample data.');
        setMatches(sampleFixturesData.data);
        setTable(sampleTableData.tables[0].entries);
        setMatchweek(sampleTableData.matchweek);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
  };

  return (
    <div className="bg-pl-purple min-h-screen font-poppins text-white">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <main className="container mx-auto p-4 md:p-8">
        {error && currentPage === 'home' && <p className="text-center text-red-400 mb-4">{error}</p>}
        
        {currentPage === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <MatchweekFixtures matches={matches} matchweek={matchweek} loading={loading} />
            <LeagueTableSnippet table={table} loading={loading} />
          </div>
        )}

        {currentPage === 'fpl-stats' && (
          <FplStats />
        )}
      </main>
    </div>
  );
};

export default App;
