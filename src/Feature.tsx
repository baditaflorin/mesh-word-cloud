import { useState } from "react";
import { useSharedWordCloud } from "@baditaflorin/mesh-common";
import type { MeshConfig, YRoom } from "@baditaflorin/mesh-common";

type Props = { room: YRoom | null; config: MeshConfig };

export function Feature({ room, config }: Props) {
  const cloud = useSharedWordCloud(room);
  const [word, setWord] = useState("");
  const submit = () => {
    if (cloud.submit(word)) setWord("");
  };

  return (
    <main className="word-cloud">
      <h1>{config.appName}</h1>
      <p className="lede">One word from each peer, gathered into a live room cloud.</p>
      <form
        className="word-form"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <label htmlFor="word">Your word</label>
        <div>
          <input
            id="word"
            maxLength={40}
            placeholder="optimistic"
            value={word}
            onChange={(event) => setWord(event.target.value)}
          />
          <button type="submit">Add word</button>
        </div>
      </form>
      <p className="word-count" aria-live="polite">
        {cloud.entries.length} peer{cloud.entries.length === 1 ? "" : "s"} contributed
      </p>
      <section aria-label="Shared words" className="cloud">
        {cloud.words.length ? (
          cloud.words.map((entry) => (
            <span className={`word word-${Math.min(entry.count, 4)}`} key={entry.word}>
              {entry.word} <small>×{entry.count}</small>
            </span>
          ))
        ) : (
          <p className="empty">The first word sets the tone.</p>
        )}
      </section>
      <p className="feature-status">
        {room ? `Connected · ${room.peerCount} peer(s)` : "Connecting…"}
      </p>
    </main>
  );
}
