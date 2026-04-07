/* Castford Raindrop Geometry — v1
   Injects cascading geometric shapes on pages that import this script.
   Skip injection on pages with data-no-rain attribute on <html>.
   Respects prefers-reduced-motion. */

(function(){
  if(document.documentElement.hasAttribute('data-no-rain')) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var shapes = [
    {cls:'cf-diamond',sz:[5,8]},
    {cls:'cf-diamond-o',sz:[7,10]},
    {cls:'cf-hex',sz:[7,10]},
    {cls:'cf-line',sz:[18,36]},
    {cls:'cf-dot',sz:[3,5]},
    {cls:'cf-plus',sz:[6,10]}
  ];

  var columns = [4,10,18,26,34,42,50,58,66,74,82,90,96];
  var field = document.createElement('div');
  field.className = 'cf-rain-field';

  columns.forEach(function(col, ci){
    var count = 2 + Math.floor(Math.random() * 2);
    for(var i = 0; i < count; i++){
      var s = shapes[Math.floor(Math.random() * shapes.length)];
      var sz = s.sz[0] + Math.floor(Math.random() * (s.sz[1] - s.sz[0]));
      var spd = 7 + Math.random() * 8;
      var del = Math.random() * 12;
      var peak = 0.12 + Math.random() * 0.25;
      var jitter = (Math.random() - 0.5) * 4;

      var el = document.createElement('div');
      el.className = 'cf-drop ' + s.cls;
      el.style.cssText = 'left:' + (col + jitter) + '%;--sz:' + sz + 'px;--spd:' + spd.toFixed(1) + 's;--del:' + del.toFixed(1) + 's;--peak:' + peak.toFixed(2);
      field.appendChild(el);
    }
  });

  document.body.insertBefore(field, document.body.firstChild);
})();
