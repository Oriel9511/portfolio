import React, { memo, useRef } from 'react';
import { motion as Motion, useInView } from 'framer-motion';

const ExperienceRow = ({ job, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

    return (
        <Motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="group border-t border-white/20 py-6 transition-colors md:py-7 hover:bg-white/[0.03]"
        >
            <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-3">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{job.year}</span>
                    <h3 className="text-2xl font-serif text-white mt-2 group-hover:italic transition-all duration-300">{job.company}</h3>
                </div>

                <div className="md:col-span-3">
                    <p className="text-zinc-400 font-light text-sm uppercase tracking-wider mb-2">{job.role}</p>
                    <div className="flex flex-wrap gap-2">
                        {job.projects.map((p, i) => (
                            <span key={i} className="text-xs border border-white/10 px-2 py-1 rounded-full text-zinc-500">
                                {p}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-6">
                    <p className="text-zinc-300 font-light leading-relaxed text-sm">
                        {job.desc}
                    </p>
                </div>
            </div>
        </Motion.div>
    );
};

export default memo(ExperienceRow);
