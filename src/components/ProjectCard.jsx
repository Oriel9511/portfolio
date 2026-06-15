import React, { memo } from 'react';
import { motion as Motion } from 'framer-motion';
import { Github, ArrowRight } from 'lucide-react';

const ProjectCard = ({ project, index, onClick }) => {
    return (
        <Motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group border border-white/10 bg-white/5 hover:bg-white/10 transition-colors relative overflow-hidden"
        >
            <button
                type="button"
                onClick={onClick}
                className="w-full p-6 text-left cursor-pointer"
                data-cursor="hover"
                aria-label={`Open project details for ${project.name}`}
            >
                <div className="flex justify-between items-start mb-4">
                    <Github className="text-zinc-500" size={20} aria-hidden="true" />
                    <Motion.div
                        className="text-zinc-500 group-hover:text-white group-hover:translate-x-0 transition-all duration-300 -translate-x-2 opacity-0 group-hover:opacity-100"
                        aria-hidden="true"
                    >
                        <ArrowRight size={16} />
                    </Motion.div>
                </div>
                <h3 className="text-xl font-serif text-white mb-2 group-hover:italic transition-all duration-300">{project.name}</h3>
                <p className="text-xs font-mono text-zinc-400 mb-4">{project.tech}</p>
                <p className="text-zinc-300 text-sm font-light leading-relaxed">{project.desc}</p>
                {project.year && <p className="mt-4 text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">{project.year}</p>}
            </button>
        </Motion.article>
    )
}

export default memo(ProjectCard);
