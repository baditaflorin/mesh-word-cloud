import { useRef, useState } from "react";
import {
  MeshButton,
  MeshLaunch,
  MeshPresence,
  MeshStatusPill,
  MeshSurface,
  useSharedWordCloud,
} from "@baditaflorin/mesh-common";
import type { MeshConfig, YRoom } from "@baditaflorin/mesh-common";

type Props = { room: YRoom | null; config: MeshConfig };

const PROMPTS = [
  {
    label: "Arrival",
    question: "What are you bringing into this room?",
  },
  {
    label: "Temperature check",
    question: "What is the room feeling right now?",
  },
  {
    label: "Looking ahead",
    question: "What do you want more of after this?",
  },
] as const;

const SUGGESTIONS = ["curious", "open", "focused"] as const;

export function Feature({ room, config }: Props) {
  const cloud = useSharedWordCloud(room);
  const [word, setWord] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [notice, setNotice] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const prompt = PROMPTS[promptIndex] ?? PROMPTS[0];
  const roomSize = room ? room.peerCount + 1 : 1;
  const mine = room ? cloud.entries.find((entry) => entry.peerId === room.peerId)?.word : undefined;

  const submit = () => {
    const sharedWord = word.trim().toLocaleLowerCase();
    if (!cloud.submit(sharedWord)) return false;
    setNotice(`Your word “${sharedWord}” is now in the shared cloud.`);
    setWord("");
    return true;
  };

  const focusOrSubmit = () => {
    if (word.trim() && room) {
      submit();
      return;
    }
    inputRef.current?.focus({ preventScroll: true });
  };

  const rotatePrompt = () => {
    const nextIndex = (promptIndex + 1) % PROMPTS.length;
    const nextPrompt = PROMPTS[nextIndex] ?? PROMPTS[0];
    setPromptIndex(nextIndex);
    setNotice(`Prompt changed to ${nextPrompt.label.toLocaleLowerCase()}.`);
  };

  const cloudSummary = cloud.entries.length
    ? `${cloud.entries.length} ${cloud.entries.length === 1 ? "word" : "words"} shared`
    : "Waiting for the first word";

  return (
    <main
      className="word-cloud"
      aria-label={`${config.displayName ?? config.appName} shared reflection`}
      data-testid="room-words"
    >
      <MeshLaunch
        className="word-cloud-launch"
        eyebrow="A shared reflection"
        heading={
          <>
            One word.
            <br />
            Shared room.
          </>
        }
        promise="Choose the word that is most present. Every person adds one, and the room’s shape appears for everyone at once."
        presence={
          <div className="word-cloud-presence">
            <MeshPresence
              count={roomSize}
              label={
                room
                  ? roomSize === 1
                    ? "person in this room"
                    : "people in this room"
                  : "device joining"
              }
              state={room ? "connected" : "connecting"}
            />
            <MeshStatusPill tone={room ? "live" : "warning"} dot>
              {room ? "Room live" : "Joining room"}
            </MeshStatusPill>
          </div>
        }
        preview={
          <MeshSurface
            as="section"
            aria-label="Shared word cloud"
            className="word-cloud-stage"
            tone="accent"
            padding="lg"
          >
            <div className="word-cloud-stage-header">
              <div>
                <p className="word-cloud-stage-kicker">{prompt.label}</p>
                <p className="word-cloud-prompt">{prompt.question}</p>
              </div>
              <MeshStatusPill tone="info" dot>
                {cloudSummary}
              </MeshStatusPill>
            </div>

            <form
              className="word-form"
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
            >
              <label htmlFor="word">Your one word</label>
              <div className="word-form-controls">
                <input
                  ref={inputRef}
                  id="word"
                  maxLength={40}
                  placeholder="Write what is present"
                  value={word}
                  onChange={(event) => setWord(event.target.value)}
                  aria-describedby="word-help"
                />
                <MeshButton
                  className="word-cloud-submit"
                  type="submit"
                  disabled={!word.trim() || !room}
                >
                  Share word
                </MeshButton>
              </div>
              <p id="word-help" className="word-form-help">
                {mine
                  ? `Your current word is “${mine}”. Sharing again updates it.`
                  : "One word per person. You can update yours whenever the room changes."}
              </p>
            </form>

            <div className="word-suggestions" role="group" aria-label="Word suggestions">
              <span>Try one</span>
              {SUGGESTIONS.map((suggestion) => (
                <MeshButton
                  key={suggestion}
                  className="word-suggestion"
                  variant="quiet"
                  size="sm"
                  onClick={() => {
                    setWord(suggestion);
                    inputRef.current?.focus({ preventScroll: true });
                  }}
                >
                  {suggestion}
                </MeshButton>
              ))}
            </div>

            <div className="cloud" aria-live="polite">
              {cloud.words.length ? (
                cloud.words.map((entry) => (
                  <span
                    className={`cloud-word cloud-word-${Math.min(entry.count, 4)}`}
                    key={entry.word}
                  >
                    {entry.word}
                    <small>×{entry.count}</small>
                  </span>
                ))
              ) : (
                <p className="cloud-empty">The first word will set the room’s tone.</p>
              )}
            </div>

            <p className="feature-status" role="status" aria-live="polite">
              {notice ||
                (room
                  ? "The cloud updates across every connected device."
                  : "Connecting to the shared room…")}
            </p>
          </MeshSurface>
        }
        primaryAction={{
          label:
            word.trim() && room ? "Share this word" : mine ? "Update your word" : "Write your word",
          className: "word-cloud-primary-action",
          onClick: focusOrSubmit,
        }}
        secondaryAction={{
          label: "Change prompt",
          className: "word-cloud-secondary-action",
          onClick: rotatePrompt,
        }}
        loading={!room}
        connectionHint={
          room ? "Live changes are shared directly with this room." : "Preparing the shared room…"
        }
      />
    </main>
  );
}
