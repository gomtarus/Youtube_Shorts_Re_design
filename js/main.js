$(document).ready(function () {
  let list_count = link.length; // 갯수 만큼 리스트 생성
  //어차피 모든 배열의 갯수는 같기 때문에 title를 기준으로 길이 가져오기

  for (let i = 0; i < list_count; i++) {
    let list = ` <li>
    <div class="youtube_frame" id="video_idx_${i}"></div>
    <div class="youtbue_btn_group">
      <ul>
      <li><img src="./img/silent.png" class="sound_btn" id="vol_idx_${i}"/></li>
        <li>
          <div class="icon_main">
            <img
              src="./img/good_icon.png"
              style="padding: 10px 10px"
            />
          </div>
          <p>${Math.floor(Math.random() * 9999 + 1)}</p>
        </li>
        <li>
          <div class="icon_main">
            <img
              src="./img/not_good_icon.png"
              style="padding: 13px 10px"
            />
          </div>
          <p>싫어요</p>
        </li>
        <li>
          <div class="icon_main">
            <img
              src="./img/comment_icon.png"
              style="padding: 10px 10px"
            />
          </div>
          <p>${Math.floor(Math.random() * 1000 + 1)}</p>
        </li>
        <li>
          <div class="icon_main">
            <img
              src="./img/share_icon.png"
              style="padding: 10px 10px"
            />
          </div>
          <p>공유</p>
        </li>
        <li>
          <div class="icon_main">
            <img
              src="./img/menu_more_icon.png"
              style="padding: 20px 10px"
            />
          </div>
        </li>
        <li>
          <div class="profile_main">
            <img src="./img/profile.jpg" alt="" />
          </div>
        </li>
      </ul>
    </div>
  </li>
  `;
    $("#video_ul").append(list);
  }
  // ------------------------------------------------------ 리스트 생성
  let youtube_play = []; // 재생
  let youtube_pause = []; // 정지
  let player = []; // 플레이 정보
  let youtube_link = []; // div에 영상을 담음
  //youtube api 배열

  for (let i = 0; i < list_count; i++) {
    youtube_link.push(function youtube() {
      window.YT.ready(function () {
        v_autopaly = !i; // 0일때만 참 나머지는 거짓
        player[i] = new window.YT.Player("video_idx_" + i, {
          videoId: link[i],
          playerVars: {
            cc_load_policy: 1, // 자막 x
            controls: 0, // 컨트롤 표시 x
            disablekb: 1, // 키보드 사용 x
            playlist: link[i], // loop를 위해서는 비디오 id가 필요함
            loop: 1, // 반복 o
            mute: 1,
            autoplay: v_autopaly,
          },
        });
      });
    });

    // ----------------------------- 플레이 정보
    youtube_play.push(function play() {
      player[i].playVideo();
    });

    //------------------------- 재생
    youtube_pause.push(function pause() {
      player[i].pauseVideo();
    });

    //------------------------- 정지
    youtube_link[i](); // 메서드 실행
  }
  // 첫 영상만 자동재생을 위해 autoplay 1이고 그 후로는 0으로 들어감
  // ------------------------------------------------------ 아이프레임 생성

  let mute_count = 0;

  const vol_btn = document.querySelectorAll("[id^=vol_idx_");

  for (let i = 0; i < vol_btn.length; i++) {
    let num = i;
    vol_btn[i].addEventListener("click", run);
    function run() {
      if (player[num].isMuted() == true) {
        for (let i = 0; i < list_count; i++) {
          player[i].unMute();
          $(".sound_btn").attr("src", "./img/volume.png");
        }
      } else {
        for (let i = 0; i < list_count; i++) {
          player[i].mute();
          $(".sound_btn").attr("src", "./img/silent.png");
        }
      }
    }
  }

  // ------------------------------------------------------ 소리 on/off
  let frame = $(".video_ul");
  let frame_count = frame.children().length;
  let count = 1;

  // ---------------------------- 프레임 슬라이드
  let scroll_count = 0; // 스크롤 잠깐 off를 위한 카운트

  $(".video_ul").on("mousewheel", function (e) {
    var wheel = e.originalEvent.wheelDelta;
    var sHeight = $(document).scrollTop();

    if (wheel > 0) {
      if (sHeight < 120 && scroll_count == 0) {
        up();
        scroll_count = 1;
        setTimeout(() => {
          scroll_count = 0;
        }, 500);
        //카운트 초기화를 위한 settimeout
        //이거 안하면 스크롤 과다 시 1로 고정되어 움직이지 않음
        //무조건 스크롤이 멈춘 후 1초 후에 0으로 만듬으로
        //다시 원래 상태로 돌아와 정상 작동
      }
    } else {
      if (sHeight >= 0 && scroll_count == 0) {
        if (count > list_count - 1) {
        } else {
          down();
          scroll_count = 1;
          setTimeout(() => {
            scroll_count = 0;
          }, 500);
        }
      }
    }
  });

  function scroll_timer() {
    setTimeout(() => {
      scroll_count = 0;
    }, 500);
  }

  // ---------------------------- 스크롤 이동

  $("#up_btn").click(function () {
    up();
  });

  $("#down_btn").click(function () {
    down();
  });

  let num = 515; // px
  let play_count = 0; // 영상 재생/정지를 위한 카운트

  function up() {
    if (1 < count) {
      scroll_timer();
      frame.animate({
        top: "+=" + num + "px",
      });
      count--;
      //-------------------
      if (play_count < 1) {
        play_count = 0;
      } else {
        play_count--;
      }
      youtube_play[play_count]();
      youtube_pause[play_count + 1]();
    }
    $("#down_btn").show();
  }

  function down() {
    if (frame_count > count) {
      scroll_timer();
      frame.animate({
        top: "-=" + num + "px",
      });
      count++;
      //-------------------
      play_count++;
      youtube_play[play_count]();
      youtube_pause[play_count - 1]();
    }
    if (count == frame_count - 1) {
      $("#down_btn").hide();
    }
  }
  // ---------------------------- 위&아래 버튼
});
