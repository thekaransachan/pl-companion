
import React from 'react';
import { Match } from '../App';

interface MatchweekFixturesProps {
  matches: Match[];
  matchweek: number | null;
  loading: boolean;
}

const MatchweekFixtures: React.FC<MatchweekFixturesProps> = ({ matches, matchweek, loading }) => {
  return (
    <section className="flex flex-col space-y-6">
      <h2 className="text-2xl font-semibold text-center text-white">
        {loading ? 'Fixtures' : `Matchweek ${matchweek}`}
      </h2>
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
          matches.map((match) => (
            <div key={match.matchId} className="bg-white text-pl-purple h-10 w-full rounded-full flex justify-center items-center px-4 text-sm">
              <span className="flex-1 text-right font-semibold">{match.homeTeam.shortName}</span>
              <span className="w-12 text-center text-xs text-gray-500 font-bold">VS</span>
              <span className="flex-1 text-left font-semibold">{match.awayTeam.shortName}</span>
            </div>
          ))
        )}
      </div>
      <button className="w-full py-3 px-6 border-2 border-pl-green text-pl-green font-semibold rounded-full hover:bg-pl-green hover:text-pl-purple transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pl-green focus:ring-opacity-50">
        View Other Matches
      </button>
    </section>
  );
};

export default MatchweekFixtures;
