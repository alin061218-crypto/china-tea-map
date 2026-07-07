const CLOUDS = [
  { x: '2%', y: '8%', w: '360px', h: '110px', o: .18, d: '52s' },
  { x: '42%', y: '15%', w: '440px', h: '130px', o: .15, d: '68s' },
  { x: '9%', y: '39%', w: '300px', h: '100px', o: .13, d: '58s' },
  { x: '62%', y: '52%', w: '520px', h: '150px', o: .12, d: '76s' },
  { x: '22%', y: '72%', w: '420px', h: '120px', o: .1, d: '64s' },
];

export default function CloudAnimation() {
  return (
    <div className="cloud-field">
      {CLOUDS.map((cloud, index) => (
        <span
          key={index}
          className="cloud-wisp"
          style={{ '--x': cloud.x, '--y': cloud.y, '--w': cloud.w, '--h': cloud.h, '--o': cloud.o, '--d': cloud.d }}
        />
      ))}
    </div>
  );
}
