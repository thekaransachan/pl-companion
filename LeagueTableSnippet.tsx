
import React from 'react';
import { TableEntry } from './App';

interface LeagueTableSnippetProps {
  table: TableEntry[];
  loading: boolean;
}

const LeagueTableSnippet: React.FC<LeagueTableSnippetProps> = ({ table, loading }) => {
  const top10 = table.slice(0, 10);

  return (
    <section className="flex flex-col space-y-3">
      <div className="flex justify-between items-center px-4 font-semibold text-white/90 text-xs">
        <span className="flex-grow">Team</span>
        <span className="w-12 text-center">Points</span>
        <span className="w-8 text-center">W</span>
        <span className="w-8 text-center">L</span>
        <span className="w-8 text-center">D</span>
        <span className="w-8 text-center">GD</span>
      </div>
      <div className="flex flex-col space-y-3">
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="bg-white/10 h-10 w-full rounded-full animate-pulse"
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))
        ) : (
          top10.map((entry) => (
            <div key={entry.team.id} className="bg-white text-pl-purple h-10 w-full rounded-full flex items-center px-4 text-sm">
              <span className="flex-grow font-semibold">
                <span className="inline-block w-6 text-gray-500 font-normal">{entry.overall.position}</span>
                {entry.team.shortName}
              </span>
              <span className="w-12 text-center font-bold">{entry.overall.points}</span>
              <span className="w-8 text-center">{entry.overall.won}</span>
              <span className="w-8 text-center">{entry.overall.lost}</span>
              <span className="w-8 text-center">{entry.overall.drawn}</span>
              <span className="w-8 text-center">{entry.overall.goalsFor - entry.overall.goalsAgainst}</span>
            </div>
          ))
        )}
      </div>
      <button className="w-full py-3 px-6 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-pl-purple transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
        View Full Table
      </button>
    </section>
  );
};

export default LeagueTableSnippet;
