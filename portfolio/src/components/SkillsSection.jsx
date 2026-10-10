import React, { useState } from 'react';
import { Code2, Atom, Server, Database, Brain, Terminal, Cpu, Flame, Layers } from 'lucide-react';
import { SKILL_CATEGORIES } from '@shared/constants/categories';

export default function SkillsSection({ skills }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const publishedSkills = (skills || []).filter((s) => s.published !== false);

  const availableCategories = ['All', ...SKILL_CATEGORIES.filter((cat) =>
    publishedSkills.some((s) => s.category === cat)
  )];

  const filteredSkills = publishedSkills.filter((s) => {
    if (activeCategory === 'All') return true;
    return s.category === activeCategory;
  });

  return (
    <section className="section" id="skills">
      <div className="portfolio-container">
        <div className="section-header">
          <div className="section-tag">
            <Code2 size={13} />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">
            Curated tools, languages, and frameworks used to engineer resilient production solutions.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="skills-filter-tabs">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              className={`skills-tab-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div className="skills-cards-grid">
          {filteredSkills.map((skill) => (
            <div key={skill.id || skill.name} className="skill-chip">
              <div className="skill-top">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-level-badge">{skill.level || 'Advanced'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{skill.category}</span>
                <span style={{ fontSize: '0.7rem', color: '#818cf8', fontFamily: 'monospace' }}>
                  {skill.icon || 'Code'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
