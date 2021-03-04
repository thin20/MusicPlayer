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
 * 10. Play song when click
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
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const currentTimeOfSong = $('.current-time');
const durationTimeOfSong = $('.duration-time');

const app = {
        currentIndex: 0,
        isPlaying: false,
        isRandom: false,
        isRepeat: false,
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
            const htmls = this.songs.map((song, index) => {
                return `
            <div class="song ${index == 0 ? 'active' : ''}" data-id="${index}">
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
            playlist.innerHTML = htmls.join("\n");
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
                _this.getTimeOfSong();
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
                if (_this.isRandom) {
                    _this.playRandomSong();
                } else {
                    _this.nextSong();
                }
                audio.play();
                _this.addClassActive();
                _this.scrollToActiveSong();
            }

            // Xử lý sự kiện khi prev bài hát
            prevBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong();
                } else {
                    _this.prevSong();
                }
                audio.play();
                _this.addClassActive();
                _this.scrollToActiveSong();
            }

            // Xử lý sự kiện khi nhấn random
            randomBtn.onclick = function() {
                    if (_this.isRepeat) {
                        _this.isRandom = !_this.isRandom;
                        randomBtn.classList.toggle('active', _this.isRandom);
                    }

                    // Xử lý lặp lại một bài hát
                    repeatBtn.onclick = function() {
                        _this.isRepeat = !_this.isRepeat;
                        repeatBtn.classList.toggle('active', _this.isRepeat);
                    }

                    // Xử lý sự kiện khi hết bài hát
                    audio.onended = function() {
                        if (_this.isRepeat) {
                            audio.play();
                        } else {
                            nextBtn.click();
                        }
                    }

                    // Lắng nghe sự kiện khi click vào playlist 
                    playlist.onclick = function(e) {
                        const songElement = e.target.closest('.song:not(.active)');
                        if (e.target.closest('.option')) {
                            return;
                        }
                        if (songElement) {
                            _this.currentIndex = songElement.dataset.id;
                            _this.loadCurrentSong();
                            _this.addClassActive();
                            audio.play();
                        }
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
                playRandomSong: function() {
                    let newIndex;
                    do {
                        newIndex = Math.floor(Math.random() * this.songs.length);
                    } while (this.currentIndex === newIndex);
                    this.currentIndex = newIndex;
                    this.loadCurrentSong();
                },
                addClassActive: function() {
                    const listSong = $$('.song');
                    $('.song.active').classList.remove('active');

                    listSong[this.currentIndex].classList.add('active');

                },
                scrollToActiveSong: function() {
                    setTimeout(() => {
                        $('.song.active').scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                        });
                    }, 300);
                },
                getTimeOfSong: function() {
                    setInterval(() => {
                        currentTimeOfSong.innerText = ConvertSecondsToMinutes(audio.currentTime);
                        durationTimeOfSong.innerText = ConvertSecondsToMinutes(audio.duration);
                    }, 100);

                },
                start: function() {
                    // Định nghĩa các thuộc tính cho object
                    this.defineProperties();

                    // Tải thông tin bài hát đầu tiên vào UI
                    this.loadCurrentSong();

                    // Lắng nghe / xử lý các sự kiện (DOM events)
                    this.handleEvents();

                    // Render playlist
                    this.render();
                }
        }

            app.start();

        function ConvertSecondsToMinutes(seconds) {
            let m, s;
            m = Math.floor(seconds / 60);
            s = Math.floor(seconds) - m * 60;
            if (m < 10) {
                m = '0' + m;
            }
            if (s < 10) {
                s = '0' + s;
            }
            return m + ':' + s;
        }