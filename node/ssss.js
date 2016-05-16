"use strict";
let _=require("lodash")

let xx={
    "tracks" : {
        "href" : "https://api.spotify.com/v1/search?query=%E7%A2%8E%E8%83%B8%E5%8F%A3&offset=0&limit=20&type=track&market=HK",
        "items" : [ {
            "album" : {
                "album_type" : "album",
                "available_markets" : [ "AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID" ],
                "external_urls" : {
                    "spotify" : "https://open.spotify.com/album/7ztgS4YEcGWTHJbeYd06i5"
                },
                "href" : "https://api.spotify.com/v1/albums/7ztgS4YEcGWTHJbeYd06i5",
                "id" : "7ztgS4YEcGWTHJbeYd06i5",
                "images" : [ {
                    "height" : 639,
                    "url" : "https://i.scdn.co/image/d481454a06d6aa2ae015289a3234b1853e87e24d",
                    "width" : 614
                }, {
                    "height" : 300,
                    "url" : "https://i.scdn.co/image/cb42b71782ff6cde00c8dfa755f8750d9341cdd2",
                    "width" : 288
                }, {
                    "height" : 64,
                    "url" : "https://i.scdn.co/image/ddfd46e14aa26ac04fee02f76aa7d397c240027f",
                    "width" : 61
                } ],
                "name" : "萬能青年旅店 (Omnipotent Youth Society)",
                "type" : "album",
                "uri" : "spotify:album:7ztgS4YEcGWTHJbeYd06i5"
            },
            "artists" : [ {
                "external_urls" : {
                    "spotify" : "https://open.spotify.com/artist/4ntvojSPscU3PxselAEeY2"
                },
                "href" : "https://api.spotify.com/v1/artists/4ntvojSPscU3PxselAEeY2",
                "id" : "4ntvojSPscU3PxselAEeY2",
                "name" : "萬能青年旅店",
                "type" : "artist",
                "uri" : "spotify:artist:4ntvojSPscU3PxselAEeY2"
            } ],
            "available_markets" : [ "AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID" ],
            "disc_number" : 1,
            "duration_ms" : 423533,
            "explicit" : false,
            "external_ids" : {
                "isrc" : "HKI321111743"
            },
            "external_urls" : {
                "spotify" : "https://open.spotify.com/track/3oowTHF9k3DbIvnShCFTke"
            },
            "href" : "https://api.spotify.com/v1/tracks/3oowTHF9k3DbIvnShCFTke",
            "id" : "3oowTHF9k3DbIvnShCFTke",
            "name" : "大石碎胸口 (The Boulder That Crushes the Breast)",
            "popularity" : 24,
            "preview_url" : "https://p.scdn.co/mp3-preview/9f59e274295ae8fcc6a45d047e337dac0801b009",
            "track_number" : 4,
            "type" : "track",
            "uri" : "spotify:track:3oowTHF9k3DbIvnShCFTke"
        } ],
        "limit" : 20,
        "next" : null,
        "offset" : 0,
        "previous" : null,
        "total" : 1
    }
}

let aaa=[]

_.map(xx.tracks.items,function(record){
   let qq=[]
    _.map(record.artists,function(ss){
        qq.push(ss.name)});

    aaa.push({"qq":qq.join("/")})

})
console.log(aaa)

console.log(new Date(new Date().getTime()-3500000))

