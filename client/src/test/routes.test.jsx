import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ControlsProvider } from '../context/ControlsContext.jsx';
import About from '../pages/About.jsx';
import { Header } from '../components/layout/Header.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { SignalChainSvg } from '../components/diagrams/SignalChainSvg.jsx';
import { EventLogTable } from '../components/ui/EventLogTable.jsx';
import { RecommendationTile } from '../components/tiles/RecommendationTile.jsx';
import { InstrumentTile } from '../components/tiles/InstrumentTile.jsx';

describe('AudiaHybrid Offline UI & Component Tests (Backend OFF)', () => {
  it('renders Header with navigation landmarks and offline badge', () => {
    render(
      <ControlsProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ControlsProvider>
    );
    expect(screen.getByText(/AudiaHybrid/i)).toBeInTheDocument();
    expect(screen.getByText(/OFFLINE/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Telemetry/i)).toBeInTheDocument();
    expect(screen.getByText(/Records/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
  });

  it('renders Footer with academic metadata and continuous analog audio path text', () => {
    render(
      <ControlsProvider>
        <Footer />
      </ControlsProvider>
    );
    expect(screen.getByText(/25SC2008E/i)).toBeInTheDocument();
    expect(screen.getByText(/Continuous Analog Audio Path/i)).toBeInTheDocument();
  });

  it('renders InstrumentTile in offline stale state with stale notice', () => {
    render(
      <InstrumentTile
        channel="optical"
        title="Channel 01 • Optical Flux"
        rawValue={null}
        isStale={true}
      />
    );
    expect(screen.getByText(/Channel 01 • Optical Flux/i)).toBeInTheDocument();
    expect(screen.getByText(/No data for 5 s/i)).toBeInTheDocument();
  });

  it('renders RecommendationTile in stale offline state', () => {
    render(
      <RecommendationTile
        opticalCount={0}
        rfCount={0}
        isStale={true}
      />
    );
    expect(screen.getByText(/Link Recommendation/i)).toBeInTheDocument();
    expect(screen.getByText(/RECOMMEND: NONE/i)).toBeInTheDocument();
  });

  it('renders SignalChainSvg interactive topology diagram', () => {
    render(<SignalChainSvg />);
    expect(screen.getByText(/As-Built Analog Hardware Signal Chain Diagram/i)).toBeInTheDocument();
    expect(screen.getByText(/LM741 Pre-Amp/i)).toBeInTheDocument();
    expect(screen.getByText(/RC Low-Pass/i)).toBeInTheDocument();
    expect(screen.getByText(/PAM8403 Power Amp/i)).toBeInTheDocument();
  });

  it('renders EventLogTable empty state message', () => {
    render(<EventLogTable events={[]} onClear={() => {}} />);
    expect(screen.getByText(/No system transitions recorded in this session/i)).toBeInTheDocument();
  });

  it('renders About technical report page with academic metadata and circuit specs', () => {
    render(<About />);
    expect(screen.getByText(/Technical Report/i)).toBeInTheDocument();
    expect(screen.getByText(/Design vs. Prototype Implementation Trade-offs/i)).toBeInTheDocument();
  });
});
