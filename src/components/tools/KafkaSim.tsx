"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createSeedMessages,
  kafkaCluster,
  kafkaTopics,
  produceTemplates,
  type KafkaMessage,
  type KafkaTopicName,
} from "@/lib/tools/kafka-data";
import { suiteStepDelay } from "@/lib/tools/suite-pace";

export function KafkaSim() {
  const [messages, setMessages] = useState<KafkaMessage[]>(() => createSeedMessages());
  const [topicName, setTopicName] = useState<KafkaTopicName>(kafkaTopics[0].name);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [consuming, setConsuming] = useState(false);
  const [consumedIds, setConsumedIds] = useState<string[]>([]);
  const [produceLog, setProduceLog] = useState<string[]>([]);

  const topic = useMemo(
    () => kafkaTopics.find((item) => item.name === topicName) ?? kafkaTopics[0],
    [topicName],
  );

  const topicMessages = useMemo(
    () =>
      messages
        .filter((message) => message.topic === topicName)
        .sort((a, b) => a.offset - b.offset),
    [messages, topicName],
  );

  const selected =
    topicMessages.find((message) => message.id === selectedId) ??
    topicMessages[topicMessages.length - 1] ??
    null;

  useEffect(() => {
    if (!consuming) return;

    const pending = topicMessages.filter((message) => !consumedIds.includes(message.id));
    if (!pending.length) {
      const stop = window.setTimeout(() => setConsuming(false), 0);
      return () => window.clearTimeout(stop);
    }

    const timer = window.setTimeout(() => {
      const next = pending[0];
      setConsumedIds((current) => [...current, next.id]);
      setSelectedId(next.id);
    }, suiteStepDelay(650));

    return () => window.clearTimeout(timer);
  }, [consuming, topicMessages, consumedIds]);

  const produce = () => {
    const template = produceTemplates[topicName];
    const partition = Math.floor(Math.random() * topic.partitions);
    const sameTopic = messages.filter((message) => message.topic === topicName);
    const offset =
      sameTopic.length === 0
        ? 0
        : Math.max(...sameTopic.map((message) => message.offset)) + 1;

    const message: KafkaMessage = {
      id: `msg-${Date.now()}`,
      topic: topicName,
      partition,
      offset,
      key: template.key,
      timestamp: new Date().toISOString(),
      value: {
        ...template.value,
        producedAt: new Date().toISOString(),
        producer: kafkaCluster.clientId,
      },
    };

    setMessages((current) => [...current, message]);
    setSelectedId(message.id);
    setProduceLog((current) => [
      `PRODUCE ${topicName} p=${partition} offset=${offset} key=${message.key}`,
      ...current,
    ].slice(0, 12));
  };

  const lag = topicMessages.filter((message) => !consumedIds.includes(message.id)).length;

  return (
    <div className="min-h-[560px] border border-line bg-surface/40">
      <div className="border-b border-line px-4 py-3 sm:px-5">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">
          Kafka lab
        </p>
        <h3 className="mt-1 text-lg text-text">Event streaming simulation</h3>
        <p className="mt-1 text-sm text-muted">
          Topics for portfolio page views, contact intake, QA results and Tools audit
          events. Produce messages and consume them by offset.
        </p>
      </div>

      <div className="grid gap-3 border-b border-line px-4 py-3 sm:grid-cols-4 sm:px-5">
        <div className="border border-line bg-bg/40 px-3 py-2">
          <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
            Cluster
          </p>
          <p className="mt-1 font-mono text-xs text-text">{kafkaCluster.id}</p>
        </div>
        <div className="border border-line bg-bg/40 px-3 py-2">
          <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
            Brokers
          </p>
          <p className="mt-1 font-mono text-xs text-text">
            {kafkaCluster.brokers.join(", ")}
          </p>
        </div>
        <div className="border border-line bg-bg/40 px-3 py-2">
          <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
            Client
          </p>
          <p className="mt-1 font-mono text-xs text-text">{kafkaCluster.clientId}</p>
        </div>
        <div className="border border-line bg-bg/40 px-3 py-2">
          <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
            Consumer lag
          </p>
          <p className="mt-1 font-mono text-xs text-accent">{lag}</p>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-line lg:border-b-0 lg:border-r">
          <div className="border-b border-line px-4 py-3">
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
              Topics
            </p>
          </div>
          <ul>
            {kafkaTopics.map((item) => {
              const count = messages.filter((message) => message.topic === item.name).length;
              return (
                <li key={item.name}>
                  <button
                    type="button"
                    onClick={() => {
                      setTopicName(item.name);
                      setConsuming(false);
                    }}
                    className={`w-full px-4 py-3 text-left transition ${
                      topicName === item.name
                        ? "bg-accent-soft text-text"
                        : "text-muted hover:bg-bg/50 hover:text-text"
                    }`}
                  >
                    <span className="block font-mono text-xs text-accent">{item.name}</span>
                    <span className="mt-1 block text-[0.7rem] opacity-80">
                      {item.partitions} partitions · {count} messages
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="min-w-0">
          <div className="border-b border-line px-4 py-3 sm:px-5">
            <p className="text-sm text-muted">{topic.description}</p>
            <p className="mt-2 font-mono text-[0.7rem] text-muted">
              group.id = <span className="text-accent">{topic.consumerGroup}</span> · rf=
              {topic.replicationFactor}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary" onClick={produce}>
                Produce message
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={consuming || lag === 0}
                onClick={() => setConsuming(true)}
              >
                {consuming ? "Consuming..." : "Start consumer"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setConsumedIds([]);
                  setConsuming(false);
                }}
              >
                Reset offsets
              </button>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="border-b border-line lg:border-b-0 lg:border-r">
              <div className="border-b border-line px-4 py-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                Topic log
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {topicMessages.length ? (
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-surface font-mono text-muted">
                      <tr className="border-b border-line">
                        <th className="px-3 py-2">P</th>
                        <th className="px-2 py-2">Offset</th>
                        <th className="px-2 py-2">Key</th>
                        <th className="px-3 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topicMessages.map((message) => {
                        const consumed = consumedIds.includes(message.id);
                        return (
                          <tr
                            key={message.id}
                            className={`cursor-pointer border-b border-line/70 hover:bg-bg/50 ${
                              selected?.id === message.id ? "bg-accent-soft/40" : ""
                            }`}
                            onClick={() => setSelectedId(message.id)}
                          >
                            <td className="px-3 py-2 font-mono text-accent">
                              {message.partition}
                            </td>
                            <td className="px-2 py-2 font-mono">{message.offset}</td>
                            <td className="max-w-[140px] truncate px-2 py-2 text-text/85">
                              {message.key}
                            </td>
                            <td className="px-3 py-2 font-mono">
                              <span className={consumed ? "text-pass" : "text-warn"}>
                                {consumed ? "consumed" : "queued"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="px-4 py-3 text-sm text-muted">No messages in this topic.</p>
                )}
              </div>
            </div>

            <div className="px-4 py-3 sm:px-5">
              <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                Message detail
              </p>
              {selected ? (
                <div className="mt-2 space-y-2">
                  <dl className="grid gap-2 font-mono text-[0.7rem] text-muted sm:grid-cols-2">
                    <div>
                      <dt>Topic</dt>
                      <dd className="text-accent">{selected.topic}</dd>
                    </div>
                    <div>
                      <dt>Timestamp</dt>
                      <dd className="text-text">{selected.timestamp}</dd>
                    </div>
                    <div>
                      <dt>Partition / Offset</dt>
                      <dd className="text-text">
                        {selected.partition} / {selected.offset}
                      </dd>
                    </div>
                    <div>
                      <dt>Key</dt>
                      <dd className="text-text">{selected.key}</dd>
                    </div>
                  </dl>
                  <pre className="max-h-[240px] overflow-auto border border-line bg-bg p-3 font-mono text-[0.72rem] leading-relaxed text-text/90">
                    {JSON.stringify(selected.value, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted">Select a message to inspect payload.</p>
              )}

              {produceLog.length ? (
                <div className="mt-4">
                  <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                    Producer log
                  </p>
                  <pre className="mt-2 whitespace-pre-wrap font-mono text-[0.68rem] leading-relaxed text-muted">
                    {produceLog.join("\n")}
                  </pre>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
