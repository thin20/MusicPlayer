/**
 * 1. Render song
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song 
 * 9. Scroll active song into view
 * 10. Play son when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('.progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const repeatBtn = $('.btn-repeat');
const randomBtn = $('.btn-random');

const app = {
    currentIndex: 0,
    isPlaying: false,
    songs: [{
            name: 'Đom đóm',
            singer: 'Jack',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg',
        }, {
            name: 'Lời xin lỗi vụng về',
            singer: 'Quân A.P',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg',
        },
        {
            name: 'Hoa hải đường',
            singer: 'Jack',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg',
        },
        {
            name: 'Gặp nhưng không ở lại',
            singer: 'Hiền hồ',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg',
        },
        {
            name: 'Bông hoa đẹp nhất',
            singer: 'Quân A.P',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg',
        },
        {
            name: 'Sóng gió',
            singer: 'Jack',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg',
        },
        {
            name: 'Thích thì đến',
            singer: 'Lê Bảo Bình',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg',
        },
        {
            name: 'Em không sai chúng ta sai',
            singer: 'Erik',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg',
        },
        {
            name: 'Bỏ lỡ một người',
            singer: 'Lê Bảo Bình',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg',
        },
        {
            name: 'Tiền nhiều để làm gì',
            singer: 'GDucky',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.jpg',
        },
        {
            name: 'Vì em so đẹp',
            singer: 'Thành Draw',
            path: './assets/music/song11.mp3',
            image: './assets/img/song11.jpg',
        },
        {
            name: 'Em của ngày hôm qua',
            singer: 'Sơn Tùng MTP',
            path: './assets/music/song12.mp3',
            image: './assets/img/song12.jpg',
        },
        {
            name: 'Âm thầm bên em',
            singer: 'Sơn Tùng MTP',
            path: './assets/music/song13.mp3',
            image: './assets/img/song13.jpg',
        },
        {
            name: 'Chắc ai đó sẽ về',
            singer: 'Sơn Tùng MTP',
            path: './assets/music/song14.mp3',
            image: './assets/img/song14.jpg',
        },
        {
            name: 'Sao anh chưa về nhà',
            singer: 'AMEE; Ricky Star',
            path: './assets/music/song15.mp3',
            image: './assets/img/song15.jpg',
        },
    ],
    render: function() {
        const htmls = this.songs.map(song => {
            return `
            <div class="song">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        })
        $('.playlist').innerHTML = htmls.join("\n");
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();
        console.log(cdThumbAnimate);

        // Xử lý phóng to hoặc thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            const newOpacity = newCdWidth / cdWidth;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newOpacity;
        }

        // Xử lý khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }

        }

        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(100 * audio.currentTime / audio.duration);
                progress.value = progressPercent;
            }
        }

        // Xử lý sự kiện khi tua bài hát
        progress.onchange = function(e) {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        // Xử lý sự kiện khi next bài hát
        nextBtn.onclick = function() {
            _this.nextSong();
            audio.play();
        }

        // Xử lý sự kiện khi prev bài hát
        prevBtn.onclick = function() {
            _this.prevSong();
            audio.play();
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
        this.currentIndex += 1;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex -= 1;
        if (this.currentIndex <= -1) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    start: function() {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong();

        // Render playlist
        this.render();
    }
}

app.start();