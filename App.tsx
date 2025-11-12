
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

      try {
        // Step 1: Fetch current gameweek
        const gamweekResponse = await fetch('/api/pl-config/current-gameweek.json');
        if (!gamweekResponse.ok) throw new Error('Failed to fetch current gameweek');
        const gamweekData = await gamweekResponse.json();
        const currentGameweek = gamweekData.matchweek;

        if (!currentGameweek) {
          throw new Error('Could not find gameweek in response');
        }

        // Step 2: Fetch matches and table for current gameweek
        const [matchesResponse, tableResponse] = await Promise.all([
          fetch(`/api/premier-league/v1/competitions/8/seasons/2025/matchweeks/${currentGameweek}/matches`),
          fetch(`/api/premier-league/v5/competitions/8/seasons/2025/matchweeks/${currentGameweek}/standings?live=false`)
        ]);

        if (!matchesResponse.ok) throw new Error('Failed to fetch matches');
        if (!tableResponse.ok) throw new Error('Failed to fetch table');

        const matchesData = await matchesResponse.json();
        const tableData = await tableResponse.json();
        
        setMatches(matchesData.data);
        setTable(tableData.tables[0].entries);
        setMatchweek(currentGameweek);

      } catch (e) {
        console.error("Failed to fetch data:", e);
        setError(e instanceof Error ? e.message : 'An unknown error occurred while fetching data.');
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
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
