import React, { useEffect, useRef } from "react";

export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    let stars = [];

    const init = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;

      const depth = 4; // độ sâu "không gian"
      const count = 420; // số lượng sao
      stars = Array.from({ length: count }).map(() => {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * Math.max(w, h) * 0.4;
        const colorRoll = Math.random();
        const color =
          colorRoll < 0.75
            ? "255,255,255"
            : colorRoll < 0.9
            ? "190,220,255"
            : "215,190,255";

        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: Math.random() * depth + 0.4, // tránh 0 để không chia cho 0
          color,
          twinkleSpeed: Math.random() * 1.6 + 1.0,
          twinklePhase: Math.random() * Math.PI * 2,
        };
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      const time = performance.now() / 1000;

      const centerX = w / 2;
      const centerY = h / 2;
      const depth = 4;
      const speed = 0.005; // tốc độ chạy về phía màn hình (rất chậm)

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Tiến dần về phía người xem
        s.z -= speed;
        if (s.z <= 0.1) {
          // reset xa ra phía sau
          s.z = depth;
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * Math.max(w, h) * 0.4;
          s.x = Math.cos(angle) * radius;
          s.y = Math.sin(angle) * radius;
        }

        const k = 300 / s.z; // hệ số phối cảnh
        const screenX = centerX + s.x * k;
        const screenY = centerY + s.y * k;

        // sao ngoài màn hình thì respawn
        if (screenX < -50 || screenX > w + 50 || screenY < -50 || screenY > h + 50) {
          s.z = depth;
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * Math.max(w, h) * 0.35;
          s.x = Math.cos(angle) * radius;
          s.y = Math.sin(angle) * radius;
          continue;
        }

        // Sao rất nhỏ, chỉ phóng nhẹ khi lại gần và bị giới hạn kích thước tối đa
        const baseSize = 0.35;
        const rawSize = baseSize + 0.45 / s.z;
        const size = Math.min(rawSize, 0.9); // không cho sao to quá
        // tăng độ sáng tổng thể và biên độ nhấp nháy
        const baseOpacity = 0.90 + 1.8 / s.z; // gần hơn thì sáng hơn rõ
        const twinkle =
          0.28 * Math.sin(time * s.twinkleSpeed + s.twinklePhase);
        const opacity = Math.max(0, Math.min(1, baseOpacity + twinkle));

        ctx.globalAlpha = opacity;
        ctx.fillStyle = `rgba(${s.color},1)`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener("resize", init);
    return () => {
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-90"
    />
  );
}
