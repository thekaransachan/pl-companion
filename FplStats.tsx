import React, { useState, useEffect, useMemo } from 'react';
import WarningIcon from './icons/WarningIcon';

// --- Type Definitions ---
interface FplPlayer {
  id: number;
  web_name: string;
  team: number; // team code
  element_type: number; // 1: GK, 2: DEF, 3: MID, 4: FWD
  now_cost: number; // Price * 10
  selected_by_percent: string;
  form: string;
  total_points: number;
  ep_next: string; // "Extra stat"
}

interface FplTeam {
  id: number;
  name: string;
}

const positionMap: { [key: number]: string } = { 1: 'GK', 2: 'DEF', 3: 'MID', 4: 'ATT' };
const positionFilterOptions = { 'All': 'All', 'GK': 1, 'DEF': 2, 'MID': 3, 'ATT': 4 };

const FplStats: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [players, setPlayers] = useState<FplPlayer[]>([]);
    const [teams, setTeams] = useState<FplTeam[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    // Filters State
    const [selectedPosition, setSelectedPosition] = useState('All');
    const [selectedTeam, setSelectedTeam] = useState('All');
    const [maxPrice, setMaxPrice] = useState(16);
    const [sortBy, setSortBy] = useState('total_points');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const playersPerPage = 11;

    // Data fetching
    useEffect(() => {
        const fetchFplData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/fpl/bootstrap-static/');
                if (!response.ok) {
                    throw new Error(`Failed to fetch FPL data. Status: ${response.status}`);
                }
                const text = await response.text();
                if (!text) {
                    throw new Error('Empty response from server');
                }
                try {
                    const data = JSON.parse(text);
                    setPlayers(data.elements);
                    setTeams(data.teams);
                } catch (parseError) {
                    console.error("JSON Parse Error. Response length:", text.length);
                    console.error("First 500 chars:", text.substring(0, 500));
                    throw new Error('Invalid JSON response from server');
                }
            } catch (e) {
                console.error("FPL API Error:", e);
                setError(e instanceof Error ? e.message : 'An unknown error occurred while fetching FPL data.');
            } finally {
                setLoading(false);
            }
        };

        fetchFplData();
    }, []);

    const teamMap = useMemo(() => teams.reduce((acc, team) => {
        acc[team.id] = team.name;
        return acc;
    }, {} as { [key: number]: string }), [teams]);

    const filteredAndSortedPlayers = useMemo(() => {
        let filteredPlayers = [...players];

        if (selectedPosition !== 'All') {
            const positionId = positionFilterOptions[selectedPosition as keyof typeof positionFilterOptions];
            filteredPlayers = filteredPlayers.filter(p => p.element_type === positionId);
        }

        if (selectedTeam !== 'All') {
            const teamId = teams.find(t => t.name === selectedTeam)?.id;
            if (teamId) {
                filteredPlayers = filteredPlayers.filter(p => p.team === teamId);
            }
        }

        filteredPlayers = filteredPlayers.filter(p => (p.now_cost / 10) <= maxPrice);

        filteredPlayers.sort((a, b) => {
            switch (sortBy) {
                case 'form': return parseFloat(b.form) - parseFloat(a.form);
                case 'selected_by_percent': return parseFloat(b.selected_by_percent) - parseFloat(a.selected_by_percent);
                case 'now_cost': return b.now_cost - a.now_cost;
                default: return b.total_points - a.total_points;
            }
        });

        return filteredPlayers;
    }, [players, teams, selectedPosition, selectedTeam, maxPrice, sortBy]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedPosition, selectedTeam, maxPrice, sortBy]);

    const indexOfLastPlayer = currentPage * playersPerPage;
    const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
    const currentPlayers = filteredAndSortedPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer);
    const totalPages = Math.ceil(filteredAndSortedPlayers.length / playersPerPage);

    const paginate = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    
    const CustomSelect: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode}> = ({label, value, onChange, children}) => (
        <div className="relative h-12">
            <select
                value={value}
                onChange={onChange}
                aria-label={label}
                className="w-full h-full appearance-none bg-pl-purple border border-white rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-pl-green cursor-pointer"
            >
                {children}
            </select>
            <span className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </span>
        </div>
    );

    if (loading) {
      return (
        <section className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-pl-green border-t-transparent rounded-full animate-spin"></div>
        </section>
      );
    }

    if (error) {
        return (
            <section className="flex flex-col items-center justify-center h-96 bg-white/5 rounded-lg p-4 text-center">
                <WarningIcon />
                <h3 className="text-xl font-semibold text-white mt-4">Could not load FPL data</h3>
                <p className="text-white/70 mt-2">{error}</p>
            </section>
        )
    }

    const showExtraStat = sortBy !== 'total_points';
    const statColumnClass = showExtraStat ? 'w-[12%]' : 'w-[15%]';

    const sortByLabelMap: { [key: string]: string } = {
        'now_cost': 'Price',
        'form': 'Form',
        'selected_by_percent': 'Owned (%)',
    };
    const extraStatLabel = showExtraStat ? sortByLabelMap[sortBy] : '';

    const getExtraStatValue = (player: FplPlayer) => {
        switch (sortBy) {
            case 'now_cost':
                return `£${(player.now_cost / 10).toFixed(1)}`;
            case 'form':
                return player.form;
            case 'selected_by_percent':
                return `${player.selected_by_percent}%`;
            default:
                return ''; // Should not happen if showExtraStat is true
        }
    };

    return (
        <section className="flex flex-col animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-6">FPL Stats</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <CustomSelect label="Filter by position" value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)}>
                    {Object.keys(positionFilterOptions).map(pos => <option key={pos} value={pos}>{pos === 'All' ? 'Position' : pos}</option>)}
                </CustomSelect>
                
                <CustomSelect label="Filter by team" value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                    <option value="All">Team</option>
                    {teams.map(team => <option key={team.id} value={team.name}>{team.name}</option>)}
                </CustomSelect>

                <div className="bg-pl-purple border border-white rounded-xl px-4 py-2 flex flex-col justify-center h-12">
                    <label htmlFor="price-slider" className="text-xs text-white/70">Price &lt; £{maxPrice.toFixed(1)}</label>
                    <input
                        id="price-slider"
                        type="range"
                        min="3.5" max="16" step="0.1"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                        className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-pl-green"
                        aria-label={`Filter by maximum price: ${maxPrice.toFixed(1)}`}
                    />
                </div>

                <CustomSelect label="Sort by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="total_points">Sort By</option>
                    <option value="total_points">Total Points</option>
                    <option value="now_cost">Price</option>
                    <option value="form">Form</option>
                    <option value="selected_by_percent">Owned (%)</option>
                </CustomSelect>
            </div>

            <div className="w-full">
                <div className="flex text-white font-semibold mb-2 px-4 text-xs sm:text-sm opacity-80">
                    <p className="w-2/5">Player</p>
                    <p className={`${statColumnClass} text-center`}>Price</p>
                    <p className={`${statColumnClass} text-center`}>Owned</p>
                    <p className={`${statColumnClass} text-center`}>Form</p>
                    <p className={`${statColumnClass} text-center`}>Points</p>
                    {showExtraStat && <p className="w-[12%] text-center">{extraStatLabel}</p>}
                </div>

                <div className="flex flex-col space-y-2 text-white">
                    {currentPlayers.map((player) => (
                        <div key={player.id} className="flex items-center bg-white/5 rounded-lg p-3 sm:p-4 text-sm sm:text-base">
                            <div className="w-2/5">
                                <p className="font-semibold truncate">{player.web_name}</p>
                                <p className="text-xs sm:text-sm opacity-70">{teamMap[player.team]} - {positionMap[player.element_type]}</p>
                            </div>
                            <p className={`${statColumnClass} text-center font-semibold`}>£{(player.now_cost / 10).toFixed(1)}</p>
                            <p className={`${statColumnClass} text-center`}>{player.selected_by_percent}%</p>
                            <p className={`${statColumnClass} text-center`}>{player.form}</p>
                            <p className={`${statColumnClass} text-center font-bold`}>{player.total_points}</p>
                            {showExtraStat && <p className="w-[12%] text-center">{getExtraStatValue(player)}</p>}
                        </div>
                    ))}
                    {currentPlayers.length === 0 && (
                        <div className="text-center py-10 text-white/70 bg-white/5 rounded-lg">
                            No players match the current filters.
                        </div>
                    )}
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="w-10 h-10 border border-white rounded-md text-white disabled:opacity-50 transition-colors hover:bg-white/10" aria-label="Previous page">&lt;</button>
                    <span className="text-white font-semibold">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="w-10 h-10 border border-white rounded-md text-white disabled:opacity-50 transition-colors hover:bg-white/10" aria-label="Next page">&gt;</button>
                </div>
            )}
        </section>
    );
};

export default FplStats;
