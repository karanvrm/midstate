"use client";

import { motion } from 'framer-motion';
import { useCountUp } from './use-count-up';

interface StatisticProps {
  value: number;
  label: string;
  id: string;
}

const Statistic = ({ value, label, id }: StatisticProps) => {
  const count = useCountUp({ end: value, duration: 0.6, start: 0 });

  return (
    <div id={`count-up-${value}`} className="flex flex-col items-center justify-center gap-2 py-8 px-4">
      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text">
        {count}
        <span className="text-foreground">+</span>
      </div>
      <p className="text-sm sm:text-base text-muted-foreground font-medium">
        {label}
      </p>
    </div>
  );
};

export const StatsBar = () => {
  const stats: StatisticProps[] = [
    { value: 500, label: "Placements", id: "placements" },
    { value: 10, label: "Clients", id: "clients" },
    { value: 8, label: "Cities", id: "cities" },
    { value: 50, label: "Open Roles Monthly", id: "roles" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full"
    >
      <div className="w-full border-y border-border/50 bg-gradient-to-b from-background via-background/50 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border/30 py-8 md:py-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                className="flex flex-col items-center justify-center"
              >
                <Statistic {...stat} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsBar;
