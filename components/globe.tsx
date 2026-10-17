export function Globe() {
  const points = [
    [198, 75], [275, 86], [325, 128], [360, 188], [333, 250], [287, 299], [204, 319],
    [134, 295], [87, 235], [83, 160], [127, 107], [167, 150], [243, 139], [291, 185],
    [238, 222], [167, 226], [138, 188], [207, 180], [267, 267], [197, 270], [117, 250],
  ];
  const links = [[0,1],[0,10],[0,11],[1,2],[1,12],[2,3],[2,12],[3,4],[3,13],[4,5],[4,14],[5,6],[5,18],[6,7],[6,19],[7,8],[7,15],[8,9],[8,20],[9,10],[9,16],[10,11],[11,12],[11,16],[11,17],[12,13],[12,17],[13,14],[13,17],[14,15],[14,17],[14,18],[14,19],[15,16],[15,17],[15,19],[15,20],[16,17],[18,19],[19,20],[8,16],[1,11],[6,18]];
  return <div className="globe-scene" aria-hidden="true">
    <div className="globe-aura" />
    <svg className="globe-svg" viewBox="0 0 440 400" fill="none">
      <defs>
        <radialGradient id="planet" cx=".35" cy=".3" r=".75"><stop stopColor="var(--color-navy-raised)" stopOpacity=".26"/><stop offset="1" stopColor="var(--color-navy-raised)" stopOpacity=".2"/></radialGradient>
        <linearGradient id="planet-line" x1="90" y1="60" x2="350" y2="330" gradientUnits="userSpaceOnUse"><stop stopColor="var(--color-cyan)"/><stop offset="1" stopColor="var(--color-globe-line)" stopOpacity=".15"/></linearGradient>
        <filter id="point-glow"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>
      <ellipse cx="220" cy="197" rx="190" ry="74" transform="rotate(-25 220 197)" stroke="var(--color-globe-line)" strokeOpacity=".2" strokeDasharray="3 7"/>
      <ellipse cx="220" cy="197" rx="180" ry="90" transform="rotate(32 220 197)" stroke="var(--color-globe-line)" strokeOpacity=".16"/>
      <circle cx="220" cy="197" r="133" fill="url(#planet)" stroke="url(#planet-line)"/>
      <ellipse cx="220" cy="197" rx="68" ry="133" stroke="var(--color-globe-line)" strokeOpacity=".22"/>
      <ellipse cx="220" cy="197" rx="109" ry="133" stroke="var(--color-globe-line)" strokeOpacity=".13"/>
      <ellipse cx="220" cy="197" rx="133" ry="48" stroke="var(--color-globe-line)" strokeOpacity=".2"/>
      <ellipse cx="220" cy="197" rx="133" ry="96" stroke="var(--color-globe-line)" strokeOpacity=".13"/>
      <path d="M220 64V330M87 197H353" stroke="var(--color-globe-line)" strokeOpacity=".13"/>
      {links.map(([a,b],i)=><path key={i} d={`M${points[a][0]} ${points[a][1]}L${points[b][0]} ${points[b][1]}`} stroke="var(--color-globe-line)" strokeOpacity={i%3===0?'.5':'.2'} strokeWidth=".8"/>)}
      {points.map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r={i%4===0?6:3} fill="var(--color-cyan)" opacity=".6" filter="url(#point-glow)"/><circle cx={x} cy={y} r={i%4===0?2.8:1.7} fill="var(--color-globe-point)"/></g>)}
      <circle cx="77" cy="122" r="4" fill="var(--color-globe-point)"/><circle cx="365" cy="268" r="3" fill="var(--color-globe-point)"/>
    </svg>
    <div className="orbit-card orbit-top"><span className="orbit-avatar">EA</span><div><strong>El talento está cerca</strong><span>Conecta con nuevas posibilidades</span></div><span className="orbit-dot"/></div>
    <div className="orbit-card orbit-bottom"><span className="orbit-check">✓</span><div><strong>Una conexión. Mil posibilidades.</strong><span>Hecho para conectar contigo</span></div></div>
    <div className="globe-location"><span className="pulse-dot"/> República Dominicana</div>
  </div>;
}
