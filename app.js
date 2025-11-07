(function () {
  const roots = document.querySelectorAll('.marquee');
  roots.forEach(root => {
    const tracks = root.querySelectorAll('.marquee__inner');
    tracks.forEach(track => setupTrack(track, root.clientWidth));
  });

  function setupTrack(track, containerW) {
    const gap = parseInt(getComputedStyle(track).getPropertyValue('--gap')) || 20;

    track.style.display = 'flex';
    track.style.gap = gap + 'px';

    // 固定每個項目寬度不收縮
    Array.from(track.children).forEach(el => el.style.flex = '0 0 auto');

    // 以「目前的原始子項」為基準做複製
    const originals = Array.from(track.children);

    // 複到超過容器寬度的 2 倍（確保無縫）
    while (track.scrollWidth < containerW * 2) {
      originals.forEach(el => track.appendChild(el.cloneNode(true)));
    }
    // 再補一輪，讓 -50% 正好銜接
    originals.forEach(el => track.appendChild(el.cloneNode(true)));
  }
})();

new Vue({
  el: '#app',
  data: {
    setlist: [
      {order:"01",name:"Overture：Open the Door, Keep My Name"},
      {order:"01",name:"見失う前に、僕を見て"},
      {order:"01",name:"零時のテーブル"},
      {order:"02",name:"Mirror Waltz — Variations"},
      {order:"02",name:"Counterpoint, Please"},
      {order:"02",name:"Bal sous la Lune"},
      {order:"02",name:"La Porte des Échos"},
      {order:"02",name:"Sea of Order"},
      {order:"03",name:"ゲートデザイナー"},
      {order:"03",name:"Runway Under the Moon"},
      {order:"03",name:"Blueprints for a Choir"},
      {order:"Encore",name:"After the Guests Leave (Acoustic)"}
    ],
    goods_list:[
      {id: 1, name: "活動場刊《The Guests》64P", des: "" , price: 780},
      {id: 2, name: "應援手燈（30cm）", des: "" , price: 880},
      {id: 3, name: "金箔票套《Invitation》", des: "" , price: 280},
      {id: 4, name: "面具徽章組（4入）", des: "" , price: 520},
      {id: 5, name: "原創 OST Mini（6曲＋口白）", des: "" , price: 520},
      {id: 5, name: "Oversize 連帽外套（夜藍）", des: "" , price: 1080},
      {id: 6, name: "LOGO T-Shirt（黑／白）", des: "" , price: 580},
      {id: 7, name: "壓克力立牌（共4款）", des: "" , price: 500},
      {id: 8, name: "A3雙面海報組（5入）", des: "" , price: 500},
      {id: 9, name: "帆布托特（磁扣／內袋）", des: "" , price: 200},
      {id: 10, name: "絲巾／領結兩用方巾（50×50cm）", des: "" , price: 350}
    ],
    target: '2025/11/16'
  },
  computed: {
    diff () {
      const to = this.parseYMD(this.target);
      if (!to) return null;

      // 以「本地時區的 00:00」來計算，避免時區與小時計算誤差
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const end   = new Date(to.y, to.m - 1, to.d);

      // 決定方向（未來 or 已過去）
      let start = today, finish = end, isPast = false;
      if (end < today) {
        start = end; 
        finish = today;
        isPast = true;
      }

      // 先粗算
      let y = finish.getFullYear() - start.getFullYear();
      let m = finish.getMonth() - start.getMonth();
      let d = finish.getDate() - start.getDate();

      // 天數不夠 → 向前借 1 個月
      if (d < 0) {
        m -= 1;
        // 取得 finish 前一個月的總天數
        const prevMonthLastDay = new Date(finish.getFullYear(), finish.getMonth(), 0).getDate();
        d += prevMonthLastDay;
      }
      // 月數不夠 → 向前借 1 年
      if (m < 0) {
        y -= 1;
        m += 12;
      }

      return { y, m, d, isPast };
    }
  },
  methods: {
    // 支援 2025/12/8、2025-12-8、2025.12.8
    parseYMD (str) {
      if (!str) return null;
      const parts = str.trim().split(/[\/\-\.]/).map(Number);
      if (parts.length !== 3) return null;
      const [y, m, d] = parts;
      if (!y || !m || !d) return null;
      // 簡單驗證：建立日期再比對
      const test = new Date(y, m - 1, d);
      if (test.getFullYear() !== y || test.getMonth() !== m - 1 || test.getDate() !== d) return null;
      return { y, m, d };
    }
  },
  async mounted() {
    
  }
})
