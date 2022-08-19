<template>
  <div>
    <main>
    <section class="p1sec">
      <div class="dw-cnt-wrap">
        <div class="dw-cnt">
        <div class="step1">
          <h1>Youtube video downloader</h1>
          <div class="input-wrap">
            <input
              type="text"
              class="main-input"
              placeholder="Paste your video link here"
              v-model.trim="videoUrl"
              @change="clickHandler()"
            />
            <button @click="clickHandler()">
              <span v-show="!isLoading">Download</span>
              <div
                v-show="isLoading"
                class="loadingio-spinner-rolling-ms15pnlb9l9"
              >
                <div class="ldio-lxaimj45ft">
                  <div></div>
                </div>
              </div>
            </button>
          </div>
        </div>
        <div v-if="step == 2" class="step2">
          <div class="step2-cnt">
            <div class="thumb-cnt">
              <img
                class="thumbnail"
                :src="video.image_url"
                width="100%"
                height="auto"
              />
              <div class="thumb-title">
                {{video.title}}
              </div>
            </div>
            <div class="thumb-data">
              <div class="btn-switch">
                <div class="btn-s" :class="{active: activeTab == 1}" @click="activeTab = 1">Video</div>
                <div class="btn-s" :class="{active: activeTab == 2}" @click="activeTab = 2">Audio</div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th v-if="activeTab == 1">Quality</th>
                    <th>Format</th>
                    <th>File size</th>
                    <th v-if="activeTab == 1" width="10"></th>
                    <th width="50"></th>
                  </tr>
                </thead>
                <tbody v-if="activeTab == 1">
                  <tr v-for="(data, index) in videoformats" :key="`suggested-${index}`">
                    <td>{{data.qualityLabel}}</td>
                    <td>{{getMediaFormat(data)}}</td>
                    <td>{{getFileSize(data)}}</td>
                    <td>
                      <svg
                        class="volume-mute"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="#dc2626"
                        stroke="#dc2626"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        v-if="!data.audioQuality"
                      >
                        <polygon
                          points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
                        ></polygon>
                        <line x1="23" y1="9" x2="17" y2="15"></line>
                        <line x1="17" y1="9" x2="23" y2="15"></line>
                      </svg>
                    </td>
                    <td><a :href="data.url" target="_blank" download>Download</a></td>
                  </tr>
                </tbody>
                <tbody v-if="activeTab == 2">
                  <tr v-for="(data, index) in audioFormats" :key="`suggested-${index}`">
                    <td>{{getMediaFormat(data)}}</td>
                    <td>{{getFileSize(data)}}</td>
                    <td><a :href="data.url" target="_blank" download>Download</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isLoading: false,
      step: 1,
      accordActiveTab: 1,
      videoUrl: '',
      video: {
        title: '',
        image_url: '',
        formats: []
      },
      activeTab: 1,
      videoformats: [],
      audioFormats: []
    };
  },
  methods: {
    async clickHandler() {
      if (!this.videoUrl) {
        return
      }
      if (this.isLoading) {
        return
      }
      this.isLoading = true;
      await axios.post('/api/yt', {url: this.videoUrl}).then(res => {
        let data = res.data.meta.videoDetails
        this.video.title = data.title
        this.video.image_url =  data.thumbnails[data.thumbnails.length - 2].url

        let suggestedFormats = []
        let otherFormats = []
        let audioFormats = []

        // formats
        let formats = [...res.data.meta.formats]
        formats.forEach(format => {
            let fsplit = format.mimeType.split(';')

            if (fsplit[0].includes("audio")) {
              audioFormats.push({...format})
            }else if (fsplit[0].includes("video") && format.audioQuality) {
              suggestedFormats.push({...format})   
            }else {
              otherFormats.push({...format})   
            }
        })
        this.videoformats = [...suggestedFormats, ...otherFormats]
        this.audioFormats = [...audioFormats]

        this.step = 2;
        this.videoUrl = ''
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
      })
    },
    clearField() {
      this.video.title = []
      this.video.image_url = ''
      this.videoformats = []
      this.step = 1
      this.videoUrl = ''
    },
    getMediaFormat(data) {
      let fsplit = data.mimeType.split(';')
      let mime = fsplit[0]
      let mimed = mime.split('/')
      return mimed[mimed.length - 1]
    },
    getFileSize(data) {
      let bytes = data.contentLength
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes == 0) return '0 Byte';
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
      
    }
  },
};
</script>

<style scoped></style>
