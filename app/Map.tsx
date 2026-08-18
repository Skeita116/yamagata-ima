"use client";

import { useEffect, useRef } from "react";
import {
  Map as MapLibreMap,
  Marker,
  Popup,
  NavigationControl,
} from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

type Camera = {
  id: number;
  name: string;
  city: string;
  stream_url: string | null;
  youtube_id: string | null;
  latitude: number;
  longitude: number;
  category: string;
};

export default function Map({ cameras }: { cameras: Camera[] }) {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new MapLibreMap({
      container: mapContainer.current,

      style: {
        version: 8,

        sources: {
          osm: {
            type: "raster",

            tiles: [
              "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],

            tileSize: 256,

            attribution: "© OpenStreetMap contributors",
          },
        },

        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },

      // 山形県の中心付近
      center: [140.1, 38.4],

      // 山形県全体が見える程度
      zoom: 7,
    });

    // 地図右上のズームボタン
    map.addControl(
      new NavigationControl(),
      "top-right"
    );

    // Supabaseから取得したカメラを地図に配置
    cameras.forEach((camera) => {
      // 緯度経度がない場合はスキップ
      if (
        camera.latitude == null ||
        camera.longitude == null
      ) {
        return;
      }

      // ポップアップの内容
      const popup = new Popup({
        offset: 25,
        maxWidth: "320px",
      }).setHTML(`
        <div
          style="
            min-width:220px;
            padding:6px;
            font-family:sans-serif;
          "
        >

          <strong
            style="
              display:block;
              font-size:16px;
              margin-bottom:6px;
            "
          >
            ${camera.name}
          </strong>

          <div
            style="
              font-size:14px;
              margin-bottom:4px;
            "
          >
            📍 ${camera.city}
          </div>

          <div
            style="
              font-size:13px;
              color:#666;
              margin-bottom:10px;
            "
          >
            カテゴリ：${camera.category}
          </div>

          ${
            camera.youtube_id
              ? `
                <div
                  style="
                    position:relative;
                    width:100%;
                    padding-bottom:56.25%;
                    margin-bottom:10px;
                  "
                >
                  <iframe
                    src="https://www.youtube.com/embed/${camera.youtube_id}"
                    style="
                      position:absolute;
                      top:0;
                      left:0;
                      width:100%;
                      height:100%;
                      border:0;
                      border-radius:8px;
                    "
                    allow="
                      accelerometer;
                      autoplay;
                      clipboard-write;
                      encrypted-media;
                      gyroscope;
                      picture-in-picture;
                    "
                    allowfullscreen
                  ></iframe>
                </div>
              `
              : ""
          }

          ${
            camera.stream_url
              ? `
                <a
                  href="${camera.stream_url}"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="
                    display:inline-block;
                    padding:8px 12px;
                    background:#2563eb;
                    color:white;
                    text-decoration:none;
                    border-radius:8px;
                    font-size:13px;
                    font-weight:bold;
                  "
                >
                  YouTubeで見る →
                </a>
              `
              : ""
          }

        </div>
      `);

      // マーカー作成
      new Marker()
        .setLngLat([
          camera.longitude,
          camera.latitude,
        ])
        .setPopup(popup)
        .addTo(map);
    });

    // コンポーネント終了時に地図を破棄
    return () => {
      map.remove();
    };
  }, [cameras]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "520px",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    />
  );
}