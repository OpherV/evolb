var level=
{
    name: "level5",
    levelWidth: 10000,
    levelHeight: 7500,
    onLevelStart: function(){

        this.blobGoal=20;

        this.showInstructionText("Reach "+this.blobGoal+" simultaneous blobs!");
        this.game.time.events.add(Phaser.Timer.SECOND * 10, function(){
            this.hideInstructionText();
        }, this);

        //finally
        this.focusOnCreatures(true);
    },
    updateGoal: function(){
        var creatureCount=this.getCreatures().length;
        this.showGoalText("Blobs: "+creatureCount+"/"+this.blobGoal);

        if (creatureCount==0){
            this.showInstructionText("Oh my, that didn't go too well did it?\n Feel free to try again!");
            this.instructionText.cameraOffset.y=this.game.height/2-this.instructionText.height/2;
        }
        else if (creatureCount==this.blobGoal){
            this.showInstructionText("You did it!");
            this.instructionText.cameraOffset.y=this.game.height/2-this.instructionText.height/2;
        }
    },
    objects: [{"x":3470.6906127929688,"y":2255.1304626464844,"angle":0,"exists":true,"id":"f3440d32-21c6-b9b4-529e-53a58b8e5a20","constructorName":"Creature","layer":"creatures"},{"x":3536.353759765625,"y":2160.9927368164062,"angle":0,"exists":true,"id":"ce259aeb-1985-b997-3a54-999305f6a708","constructorName":"Creature","layer":"creatures"},{"x":3286.1544799804688,"y":2143.142547607422,"angle":0,"exists":true,"id":"e27bf9c5-85ca-fd2e-d5bb-1f72c3ca3e4e","constructorName":"Creature","layer":"creatures"},{"x":3273.0734252929688,"y":2414.0225219726562,"angle":3.987307652125736,"exists":true,"id":"9846349c-5d91-b99c-b232-96b2a9216685","constructorName":"Creature","layer":"creatures"},{"x":3628.9456176757812,"y":2303.731689453125,"angle":0,"exists":true,"id":"87285492-af01-adf5-0da0-ba21b14dbd12","constructorName":"Creature","layer":"creatures"},{"x":2961.0000610351562,"y":2465.9999084472656,"angle":0,"exists":true,"id":"cd8ce627-3f16-4182-f1d9-e47c3a6ac7df","constructorName":"Rock","layer":"rocks","rockType":2},{"x":3328.0001831054688,"y":2584.9996948242188,"angle":-14.017015985789385,"exists":true,"id":"b068e6a6-a015-bb44-fd66-81dc7f031958","constructorName":"Rock","layer":"rocks","rockType":1},{"x":2920.999755859375,"y":2132.9998779296875,"angle":-47.146605619977606,"exists":true,"id":"ccdce045-5643-82eb-e018-b598351393d5","constructorName":"Rock","layer":"rocks","rockType":2},{"x":3692.0001220703125,"y":2617.0001220703125,"angle":29.768599486661742,"exists":true,"id":"68eececd-53ee-08d7-11de-59954970fc6a","constructorName":"Rock","layer":"rocks","rockType":2},{"x":3984.000244140625,"y":2366.000213623047,"angle":-11.852655465722279,"exists":true,"id":"5d8e03f4-458a-a064-9547-6d9fcbdeefae","constructorName":"Rock","layer":"rocks","rockType":2},{"x":4825,"y":1748,"angle":0,"exists":true,"id":"571fa3cd-03f7-2f43-7e7e-eceb154f3dfe","constructorName":"Rock","layer":"rocks","rockType":2},{"x":4983.999938964844,"y":2026.0000610351562,"angle":0,"exists":true,"id":"01170f14-42e2-09d6-26bc-d3fab28609e0","constructorName":"Rock","layer":"rocks","rockType":1},{"x":5213.00048828125,"y":2244.0000915527344,"angle":-31.67088522656732,"exists":true,"id":"42084165-dcae-f229-5e10-57959cafffba","constructorName":"Rock","layer":"rocks","rockType":2},{"x":3882.0001220703125,"y":1741.9999694824219,"angle":45.738877412614556,"exists":true,"id":"9300e16c-86e8-b4c2-711f-a825188f2611","constructorName":"Rock","layer":"rocks","rockType":2},{"x":3293.9999389648438,"y":1624.0000915527344,"angle":-80.63247603412748,"exists":true,"id":"19726200-2918-556b-1600-6dd199533c11","constructorName":"Rock","layer":"rocks","rockType":2},{"x":3612.0001220703125,"y":1748.9999389648438,"angle":0,"exists":true,"id":"ddb3b99f-ac0f-8e70-3869-a680a63a4066","constructorName":"Rock","layer":"rocks","rockType":2},{"x":3508.8406372070312,"y":1397.1635437011719,"angle":0,"exists":true,"id":"d7d4c186-b9f3-1008-7ee1-7eb97679962e","constructorName":"Enemy1","layer":"enemies"},{"x":2276.999969482422,"y":1991.9999694824219,"angle":0,"exists":true,"id":"586f83cc-9cf4-4933-0d16-23bf8805f6dc","constructorName":"Rock","layer":"rocks","rockType":2},{"x":2718.9999389648438,"y":1280.9999084472656,"angle":-143.10410029360855,"exists":true,"id":"a652cbfd-a43c-179c-63e7-f21c9c764637","constructorName":"Rock","layer":"rocks","rockType":2},{"x":4436.999816894531,"y":2668.9999389648438,"angle":0,"exists":true,"id":"3633ba37-def3-12fe-e268-a6b30df3dc8e","constructorName":"Rock","layer":"rocks","rockType":2},{"x":4760,"y":3111.0000610351562,"angle":113.25904328984933,"exists":true,"id":"efda8060-8740-230b-79e1-9f060d4138f8","constructorName":"Rock","layer":"rocks","rockType":3},{"x":4471.000061035156,"y":3327.0001220703125,"angle":-9.984413269286534,"exists":true,"id":"46129496-fa5f-606c-c2bb-c0bda8e88da5","constructorName":"Rock","layer":"rocks","rockType":2},{"x":4031.0000610351562,"y":3501.0000610351562,"angle":49.13968310899264,"exists":true,"id":"174e8e89-0768-ce26-a876-c830592817f9","constructorName":"Rock","layer":"rocks","rockType":2},{"x":3657.0001220703125,"y":3265,"angle":0,"exists":true,"id":"23cc430c-c587-5bd8-ebeb-aaa6f4ade021","constructorName":"Rock","layer":"rocks","rockType":3},{"x":2837.0001220703125,"y":3156.0000610351562,"angle":0,"exists":true,"id":"69a8d543-80d8-f54e-b87a-009f88af537b","constructorName":"Rock","layer":"rocks","rockType":2},{"x":3332.9998779296875,"y":928.0000305175781,"angle":-97.30729284156416,"exists":true,"id":"388f32ed-1692-1985-94b0-2dcd5f2286a7","constructorName":"Rock","layer":"rocks","rockType":2},{"x":3971.0000610351562,"y":975.9999847412109,"angle":30.623986211749582,"exists":true,"id":"2c608a42-bd61-cf4d-1bfa-298734f4c808","constructorName":"Rock","layer":"rocks","rockType":1},{"x":4290,"y":1225.9999084472656,"angle":0,"exists":true,"id":"12ecd6fa-d000-0bf0-4fef-95e3d64c7096","constructorName":"Rock","layer":"rocks","rockType":1},{"x":3066.0000610351562,"y":1879.0000915527344,"angle":0,"exists":true,"id":"461c7257-8783-cd84-a0cc-ba994fce9315","constructorName":"Mutation","layer":"powerUps"},{"x":3231.0000610351562,"y":1865.0001525878906,"angle":0,"exists":true,"id":"67c8f71e-114d-2e14-0667-0ae040a96211","constructorName":"Food","layer":"powerUps"},{"x":2901.0000610351562,"y":1799.0000915527344,"angle":0,"exists":true,"id":"e1cf3bc2-b178-9721-9bfc-289fa8bd65f0","constructorName":"Food","layer":"powerUps"},{"x":3065.999755859375,"y":1761.9999694824219,"angle":0,"exists":true,"id":"fde8a763-284e-163a-8d37-c909d2c88dd5","constructorName":"Food","layer":"powerUps"},{"x":4334,"y":2146,"angle":0,"exists":true,"id":"56c6ce39-0aca-560a-62cc-1b49b135dfb0","constructorName":"Food","layer":"powerUps"},{"x":4145,"y":1788,"angle":0,"exists":true,"id":"af1b10e9-381c-0b53-5f18-b340c5c335dd","constructorName":"Food","layer":"powerUps"},{"x":4544,"y":1421,"angle":0,"exists":true,"id":"eae17545-d3a2-3f14-ad96-716c1e525ab2","constructorName":"Food","layer":"powerUps"},{"x":5111,"y":1702,"angle":0,"exists":true,"id":"26aef223-7f0b-73ae-3a5a-325b61c057ca","constructorName":"Food","layer":"powerUps"},{"x":1391.9999694824219,"y":2951.9998168945312,"angle":-0.05925576907611685,"exists":true,"id":"adc89517-0f2b-d5dd-57f7-113826bfac2c","constructorName":"Rock","layer":"rocks","rockType":1},{"x":2002.0001220703125,"y":3193.9999389648438,"angle":0,"exists":true,"id":"f47976fc-3da6-8713-8463-c42cad954f27","constructorName":"Rock","layer":"rocks","rockType":2},{"x":1378.9999389648438,"y":2608.9999389648438,"angle":-19.77682187944106,"exists":true,"id":"3bc69aa7-faf1-176f-f007-ea2f07bb0c27","constructorName":"Rock","layer":"rocks","rockType":2},{"x":1780.9999084472656,"y":2491.9998168945312,"angle":43.2258817568171,"exists":true,"id":"be8c3468-e889-2985-df3b-fdee776b3358","constructorName":"Rock","layer":"rocks","rockType":2},{"x":2083.000030517578,"y":2570,"angle":-50.48523484298124,"exists":true,"id":"9d0e940a-0994-d65b-7826-4c2aa36a6666","constructorName":"Rock","layer":"rocks","rockType":3},{"x":2183.999786376953,"y":2882.9998779296875,"angle":-77.79559139663371,"exists":true,"id":"8266e4c1-587c-2ac4-a8f0-9edc6476f701","constructorName":"Rock","layer":"rocks","rockType":2},{"x":1711.9999694824219,"y":2921.9998168945312,"angle":0,"exists":true,"id":"b03f45c3-b507-9c1a-8e53-1df992089563","constructorName":"Mutation","layer":"powerUps"},{"x":1847.9998779296875,"y":2920.999755859375,"angle":0,"exists":true,"id":"a82e9c7e-6ca2-4304-9ece-60bd3ee42b5d","constructorName":"Mutation","layer":"powerUps"},{"x":1820.9999084472656,"y":2827.9998779296875,"angle":0,"exists":true,"id":"940aec4d-0d73-3f76-c976-2167713312a3","constructorName":"Mutation","layer":"powerUps"},{"x":1854.9998474121094,"y":2716.9998168945312,"angle":0,"exists":true,"id":"e57f41d4-fd51-850b-bccc-42641888160b","constructorName":"Food","layer":"powerUps"},{"x":1950.0001525878906,"y":2817.0001220703125,"angle":0,"exists":true,"id":"39300f5f-3bf1-919a-f210-50a86b2639e3","constructorName":"Food","layer":"powerUps"},{"x":1536,"y":2861,"angle":0,"exists":true,"id":"fcc17609-7ee2-e28b-870b-7755efdc07a1","constructorName":"Food","layer":"powerUps"},{"x":1527,"y":2771,"angle":0,"exists":true,"id":"cde2b2c2-c2e9-ab20-ed78-722e47a4c0fa","constructorName":"Food","layer":"powerUps"},{"x":1718.9999389648438,"y":2720,"angle":0,"exists":true,"id":"b02c1d04-4ba3-e5da-a2b0-b4c696625b89","constructorName":"Food","layer":"powerUps"},{"x":1926.9999694824219,"y":2868.9999389648438,"angle":0,"exists":true,"id":"d1977da1-7b71-3fd8-3b43-1b30adb6538a","constructorName":"Enemy1","layer":"enemies"},{"x":1608.0000305175781,"y":2676.9998168945312,"angle":0,"exists":true,"id":"1ecdc08c-d1a2-9211-49e4-641e55f876e2","constructorName":"Enemy1","layer":"enemies"},{"x":1746.0000610351562,"y":3441.0000610351562,"angle":0,"exists":true,"id":"16f90410-0078-769a-a67b-52ac35974644","constructorName":"Rock","layer":"rocks","rockType":3},{"x":2416.999969482422,"y":3631.0000610351562,"angle":0,"exists":true,"id":"03b4862f-e1d7-58e0-0bd8-7da0fcedb3d3","constructorName":"Rock","layer":"rocks","rockType":2},{"x":2953,"y":2895,"angle":0,"exists":true,"id":"1d215240-f25f-45ed-7d61-7c40f73580b9","constructorName":"Food","layer":"powerUps"},{"x":3255,"y":3257,"angle":0,"exists":true,"id":"3cbacf07-7395-582e-4ba8-5b3ed9962546","constructorName":"Food","layer":"powerUps"},{"x":3390,"y":3610,"angle":0,"exists":true,"id":"c631b9f5-a017-3d90-7033-b97d12a5073d","constructorName":"Food","layer":"powerUps"},{"x":2851,"y":3434,"angle":0,"exists":true,"id":"ee8ed67f-c1a2-8830-202d-d206473e6b0d","constructorName":"Food","layer":"powerUps"},{"x":3083,"y":4071,"angle":0,"exists":true,"id":"1b02f53d-dea4-1c84-a818-610b0109fe78","constructorName":"Food","layer":"powerUps"},{"x":3670,"y":4579,"angle":0,"exists":true,"id":"b3c1ea14-6fb2-f1b6-2f1a-523fb0010e4f","constructorName":"Food","layer":"powerUps"},{"x":4054,"y":4172,"angle":0,"exists":true,"id":"6ce8c77a-8997-3ad5-8412-1939826c65f4","constructorName":"Food","layer":"powerUps"},{"x":4479,"y":3940,"angle":0,"exists":true,"id":"cf89d13d-6cfa-db11-d6d3-2807578d5296","constructorName":"Food","layer":"powerUps"},{"x":5044,"y":3286,"angle":0,"exists":true,"id":"d3308c16-6938-8d47-563d-bf816eecb0d1","constructorName":"Food","layer":"powerUps"},{"x":2158.000030517578,"y":1541.0000610351562,"angle":0,"exists":true,"id":"50db83f3-7a9e-6ca8-e5d8-1d23ff5977d8","constructorName":"HeatArea","layer":"areas","pointArray":"[[21.999969482421875,-106.00006103515625],[200,-171.99996948242188],[388.0000305175781,-245],[579.9998474121094,-109.00009155273438],[414.9998474121094,283.0000305175781],[122.9998779296875,413.99993896484375],[-46.00006103515625,315],[-95,95]]"},{"x":2220,"y":3122.9998779296875,"angle":0,"exists":true,"id":"bcea9480-f92c-c713-f8ac-24ad25e35a3d","constructorName":"HeatArea","layer":"areas","pointArray":"[[-91.00006103515625,11.00006103515625],[93.00033569335938,-155],[242.00027465820312,-40],[455.00030517578125,22.9998779296875],[438.00018310546875,262.9998779296875],[132.00027465820312,431.00006103515625],[-41.999969482421875,217.9998779296875],[-158.00003051757812,133.99993896484375]]"},{"x":4621.999816894531,"y":2916.0000610351562,"angle":0,"exists":true,"id":"dc1ef842-9c61-6cf9-84f3-e375c7661711","constructorName":"Food","layer":"powerUps"},{"x":4652.0001220703125,"y":3774.9996948242188,"angle":0,"exists":true,"id":"fc38492f-0a22-594a-5ddd-f4a2b98dada2","constructorName":"Food","layer":"powerUps"},{"x":4175,"y":2546.0000610351562,"angle":0,"exists":true,"id":"ec1ef9c7-173c-b761-693b-6f7cbf53a288","constructorName":"Food","layer":"powerUps"},{"x":4322.0001220703125,"y":3553.9999389648438,"angle":0,"exists":true,"id":"e431320e-18ee-8223-0b36-5dbf817f6442","constructorName":"Food","layer":"powerUps"},{"x":3912.0001220703125,"y":3208.9999389648438,"angle":0,"exists":true,"id":"40f1914c-33e7-e40a-3c42-62974d046601","constructorName":"Food","layer":"powerUps"},{"x":3723,"y":1211,"angle":0,"exists":true,"id":"d0df20d4-7691-2d18-df27-6b5999f1493f","constructorName":"Food","layer":"powerUps"},{"x":3491,"y":1239,"angle":0,"exists":true,"id":"b011963e-5095-0559-cc31-f70eb73c569e","constructorName":"Food","layer":"powerUps"},{"x":3635,"y":890,"angle":0,"exists":true,"id":"d6f57dfb-950a-61ea-2938-4185c1e37e47","constructorName":"Food","layer":"powerUps"},{"x":3668.9999389648438,"y":1341.9999694824219,"angle":0,"exists":true,"id":"8411c887-90f9-3542-a46e-de87efffe6aa","constructorName":"Mutation","layer":"powerUps"},{"x":1866,"y":1575,"angle":0,"exists":true,"id":"6fcc29b3-90ff-b53f-4e4c-f1551a099fb3","constructorName":"Food","layer":"powerUps"},{"x":1966,"y":1215,"angle":0,"exists":true,"id":"b61c0069-7990-ffad-fd71-a61a6c84e854","constructorName":"Food","layer":"powerUps"},{"x":1876.0000610351562,"y":830.9999847412109,"angle":0,"exists":true,"id":"b80bded7-43c7-1d89-42cf-c1abe16b4c8a","constructorName":"Rock","layer":"rocks","rockType":1},{"x":1546.0000610351562,"y":1190,"angle":0,"exists":true,"id":"c43a94c6-7fbc-b3b7-fcf4-b68f1bb62cdd","constructorName":"Rock","layer":"rocks","rockType":3},{"x":1393.9999389648438,"y":1408.0000305175781,"angle":0,"exists":true,"id":"9ef27eb8-3809-ddbe-c69d-0a504fb14bf1","constructorName":"Rock","layer":"rocks","rockType":1},{"x":1748.0000305175781,"y":1853.9999389648438,"angle":0,"exists":true,"id":"6d111e85-91ce-6990-1837-8b463646215b","constructorName":"Rock","layer":"rocks","rockType":1},{"x":1496.9999694824219,"y":1971.9999694824219,"angle":0,"exists":true,"id":"ebf84b65-d610-a115-17a4-9e0ecbe5f0d6","constructorName":"Rock","layer":"rocks","rockType":2},{"x":2425,"y":724.0000152587891,"angle":26.82984259437967,"exists":true,"id":"3cdf2b35-230e-365a-97e0-bb07f8ff45c4","constructorName":"Rock","layer":"rocks","rockType":2},{"x":3510.0003051757812,"y":745,"angle":61.32693333615097,"exists":true,"id":"609659a4-8e12-ebd0-316c-efac91f3f4e6","constructorName":"IceArea","layer":"areas","pointArray":"[[-323.99993896484375,-830.0000190734863],[192.9998779296875,-829.0000057220459],[921.0003662109375,-864.9999809265137],[1203.0001831054688,-550],[711.0000610351562,299.00001525878906],[100,250],[-346.00006103515625,216.99996948242188],[-707.0001220703125,-398.9999771118164]]"},{"x":3562.0001220703125,"y":360,"angle":0,"exists":true,"id":"01d5ff90-c612-5213-956d-f02f34786c70","constructorName":"Rock","layer":"rocks","rockType":2},{"x":3987,"y":370,"angle":0,"exists":true,"id":"ba45d6d9-cb28-4e0f-f554-5697f49e9a02","constructorName":"Food","layer":"powerUps"},{"x":3861,"y":207,"angle":0,"exists":true,"id":"2cf66e27-9a50-c706-3e4c-e64ad968789d","constructorName":"Food","layer":"powerUps"},{"x":3355,"y":276.00000381469727,"angle":0,"exists":true,"id":"dcaf3a3a-6382-d27e-cf7c-3caceb06c830","constructorName":"Food","layer":"powerUps"},{"x":2821.0000610351562,"y":287.00000762939453,"angle":0,"exists":true,"id":"5a10a82d-4d29-ca6d-03d0-5a413ab16d3b","constructorName":"Rock","layer":"rocks","rockType":1},{"x":2615,"y":30.000007152557373,"angle":-61.05088966121477,"exists":true,"id":"f0e5da2e-b098-4e6d-238a-d328241054f0","constructorName":"Rock","layer":"rocks","rockType":2},{"x":3061,"y":224,"angle":0,"exists":true,"id":"891cedf8-1932-ac4c-63d2-409cdaf1de54","constructorName":"Food","layer":"powerUps"},{"x":2931.0000610351562,"y":153.0000114440918,"angle":0,"exists":true,"id":"9b6fcdb3-c129-c8e3-48de-6621edd2770b","constructorName":"Food","layer":"powerUps"},{"x":2853.9999389648438,"y":25.000007152557373,"angle":0,"exists":true,"id":"e23b2b7f-f333-5773-4b62-d684f908cfd7","constructorName":"Mutation","layer":"powerUps"},{"x":4705.000305175781,"y":1079.000015258789,"angle":106.15130408523612,"exists":true,"id":"12b58882-cc79-2ee8-56eb-291f45fb2c92","constructorName":"Rock","layer":"rocks","rockType":3},{"x":4937.0001220703125,"y":1192.9999542236328,"angle":-49.515408451086614,"exists":true,"id":"bd039ce6-71d9-7df8-a2b6-4415cc53836e","constructorName":"Rock","layer":"rocks","rockType":3},{"x":5457.9998779296875,"y":1493.0000305175781,"angle":-6.331901426671152,"exists":true,"id":"1ec72086-855b-cd8c-db3a-6049f7c9bd01","constructorName":"Rock","layer":"rocks","rockType":3},{"x":5327.0001220703125,"y":1950.9999084472656,"angle":0,"exists":true,"id":"18c1251d-21e4-1dbd-b910-975a82b35506","constructorName":"Enemy1","layer":"enemies"},{"x":796.9999694824219,"y":1973.0000305175781,"angle":0,"exists":true,"id":"dd27d9aa-dd13-45e3-ada7-30c3bf4e2c26","constructorName":"Rock","layer":"rocks","rockType":3},{"x":706.9999694824219,"y":2613.9999389648438,"angle":0,"exists":true,"id":"265d7e99-71ab-a217-eb68-3799c19caf9c","constructorName":"Rock","layer":"rocks","rockType":2},{"x":156.00000381469727,"y":2183.9999389648438,"angle":31.103410664298394,"exists":true,"id":"577f9916-33bb-a18a-89b6-d500db655fa8","constructorName":"Rock","layer":"rocks","rockType":1},{"x":40,"y":3440.999755859375,"angle":-18.40328416508663,"exists":true,"id":"14d5200e-0d1d-0bed-4375-05a8cf779eaa","constructorName":"Rock","layer":"rocks","rockType":3},{"x":740,"y":3282.9998779296875,"angle":0,"exists":true,"id":"a7da2bc8-3d95-b4aa-ab95-88d4d42b7771","constructorName":"Rock","layer":"rocks","rockType":2},{"x":607.9999923706055,"y":3622.9998779296875,"angle":103.95140859710955,"exists":true,"id":"69267d8f-5980-8c82-6436-19a307b4de5a","constructorName":"Rock","layer":"rocks","rockType":2},{"x":560,"y":3248,"angle":0,"exists":true,"id":"268743a0-0a5e-1279-91bd-a8c32f851373","constructorName":"Food","layer":"powerUps"},{"x":255,"y":3126.0000610351562,"angle":0,"exists":true,"id":"2a5f7d88-5458-8058-20dc-9b25152ef3b0","constructorName":"Food","layer":"powerUps"},{"x":205,"y":3681.0000610351562,"angle":0,"exists":true,"id":"83b0e4da-5151-8680-8d2c-d72ce3087a06","constructorName":"Food","layer":"powerUps"},{"x":260,"y":2698.9999389648438,"angle":0,"exists":true,"id":"a8a8bed4-495a-f64f-5162-48cf1620566d","constructorName":"Food","layer":"powerUps"},{"x":989.0000152587891,"y":2906.0000610351562,"angle":0,"exists":true,"id":"a61f95b3-8c24-3f61-11d4-9f0043f8b54d","constructorName":"Food","layer":"powerUps"},{"x":690,"y":2317.0001220703125,"angle":0,"exists":true,"id":"33bbad5e-d10a-2b20-7169-23cf1a0ecb4a","constructorName":"Food","layer":"powerUps"},{"x":587.0000076293945,"y":2096.0000610351562,"angle":0,"exists":true,"id":"7d54ffb7-c848-2294-5dec-1410244081d8","constructorName":"Food","layer":"powerUps"},{"x":577.9999923706055,"y":1455,"angle":0,"exists":true,"id":"bf3404fa-6e0a-792d-83bb-e8a4c6de2cfb","constructorName":"Food","layer":"powerUps"},{"x":323.0000305175781,"y":1491.9999694824219,"angle":0,"exists":true,"id":"29b505b5-6836-780d-34fb-d19483d95ea8","constructorName":"HeatArea","layer":"areas","pointArray":"[[-383.9999532699585,-868.0000305175781],[71.0000228881836,-824.0000152587891],[538.0000686645508,-690.9999084472656],[776.9999313354492,-90],[637.0001602172852,448.99993896484375],[218.00010681152344,528.9999389648438],[-304.9999389052391,495],[-333.99999618530273,83.99993896484375]]"},{"x":344.00001525878906,"y":1226.9999694824219,"angle":0,"exists":true,"id":"e841198d-0a2f-ebef-b165-7c0dcd636a19","constructorName":"Mutation","layer":"powerUps"},{"x":605.9999847412109,"y":1077.0000457763672,"angle":0,"exists":true,"id":"ee86ad64-b165-6a9d-21f3-5fcd3124b55a","constructorName":"Food","layer":"powerUps"},{"x":297.99999237060547,"y":940,"angle":0,"exists":true,"id":"d53deb32-3766-893a-246c-e72fabf6a2ab","constructorName":"Food","layer":"powerUps"},{"x":247.99999237060547,"y":1415,"angle":0,"exists":true,"id":"35bdfcdc-e257-2a77-5733-3b2a293ac579","constructorName":"Food","layer":"powerUps"},{"x":167.99999237060547,"y":1697.0001220703125,"angle":0,"exists":true,"id":"c606d0c2-1eb8-e5ed-e25d-d0589875716c","constructorName":"Food","layer":"powerUps"},{"x":482.0000457763672,"y":940,"angle":42.68026122374721,"exists":true,"id":"025f63a7-13f0-39b9-33a8-3ac09127e128","constructorName":"Rock","layer":"rocks","rockType":3},{"x":779.0000152587891,"y":1065,"angle":0,"exists":true,"id":"c10c977a-710d-9b29-490e-bb915d4f783b","constructorName":"Rock","layer":"rocks","rockType":1},{"x":1111.9999694824219,"y":553.9999771118164,"angle":0,"exists":true,"id":"4bb39864-8eff-121c-c87b-18a7e02d72ec","constructorName":"Rock","layer":"rocks","rockType":2},{"x":730.9999847412109,"y":281.9999885559082,"angle":0,"exists":true,"id":"616d6b98-07c2-dc82-9d6b-9006682a4612","constructorName":"Rock","layer":"rocks","rockType":1},{"x":389.00001525878906,"y":432.99999237060547,"angle":0,"exists":true,"id":"6f96208a-b967-da19-c62a-f8b9c4595a12","constructorName":"Mutation","layer":"powerUps"},{"x":232.00000762939453,"y":373.9999771118164,"angle":0,"exists":true,"id":"13766086-c233-d53c-a5e1-7cb5a1d5877a","constructorName":"Food","layer":"powerUps"},{"x":505.99998474121094,"y":473.9999771118164,"angle":0,"exists":true,"id":"0fc19504-96e8-af74-d107-5592249aac36","constructorName":"Food","layer":"powerUps"},{"x":325.5122756958008,"y":283.9378356933594,"angle":0,"exists":true,"id":"fa345712-4195-44bc-4185-c98f1a7322c6","constructorName":"Enemy1","layer":"enemies"},{"x":403.0000305175781,"y":-16.999993324279785,"angle":13.578897846957034,"exists":true,"id":"f8bae867-e560-ca2c-0ea0-22ffffb39194","constructorName":"Rock","layer":"rocks","rockType":2},{"x":1798.0000305175781,"y":240.99998474121094,"angle":0,"exists":true,"id":"a9591712-eb0a-db38-d9c0-fedfa835b625","constructorName":"Rock","layer":"rocks","rockType":1},{"x":2089,"y":524,"angle":0,"exists":true,"id":"4ca7682f-982e-887a-b6a8-f3b5bd822035","constructorName":"Food","layer":"powerUps"},{"x":1457,"y":259,"angle":0,"exists":true,"id":"116730d0-33aa-c706-21ad-f50bef8e6b20","constructorName":"Food","layer":"powerUps"},{"x":1043,"y":207,"angle":0,"exists":true,"id":"b9ebbce9-671f-e06b-d24b-b9fdde7fbafa","constructorName":"Food","layer":"powerUps"},{"x":2426,"y":365,"angle":0,"exists":true,"id":"22a23a9d-ca25-eb5c-ea38-88d7bbc5eecc","constructorName":"Food","layer":"powerUps"},{"x":1310,"y":-73.99999618530273,"angle":0,"exists":true,"id":"c0bf1828-74e6-1be2-5f3a-32c0954dfb53","constructorName":"HeatArea","layer":"areas","pointArray":"[[0,0],[100,-50],[340,-11.000003814697266],[868.9999389648438,-26.000080108642578],[895.9999084472656,360],[608.9999389648438,565.999927520752],[61.00006103515625,355],[-50,100]]"},{"x":4647.0001220703125,"y":2365,"angle":0,"exists":true,"id":"c9c2876f-5250-8613-2926-46c85541685d","constructorName":"Food","layer":"powerUps"},{"x":4872.0001220703125,"y":2666.0000610351562,"angle":0,"exists":true,"id":"2270350d-be87-b0f1-1770-22c61d8fe5e1","constructorName":"HeatArea","layer":"areas","pointArray":"[[-170,-221.00006103515625],[117.9998779296875,-341.00006103515625],[364.000244140625,-232.9998779296875],[582.9998779296875,152.0001220703125],[389.000244140625,312.9998779296875],[168.99993896484375,327.0001220703125],[2.9998779296875,241.00006103515625],[-50,100]]"},{"x":5147.0001220703125,"y":2692.0001220703125,"angle":0,"exists":true,"id":"d6fc9965-5e36-d73b-049f-15425d4c73b9","constructorName":"Mutation","layer":"powerUps"},{"x":3036.9998168945312,"y":3778.9999389648438,"angle":64.92960662739858,"exists":true,"id":"4b7d7fe1-f04d-8bd4-0a54-5cd1251223b3","constructorName":"Rock","layer":"rocks","rockType":2},{"x":3340,"y":3954.000244140625,"angle":0,"exists":true,"id":"1776e035-ad9f-20c2-67eb-962d7f06f525","constructorName":"Rock","layer":"rocks","rockType":1},{"x":3895,"y":4061.0000610351562,"angle":-26.630702089052676,"exists":true,"id":"3b420094-549a-c483-e239-bd637696bda4","constructorName":"Rock","layer":"rocks","rockType":2},{"x":3302.9998779296875,"y":4582.9998779296875,"angle":-6.431686750264191,"exists":true,"id":"d2677fd2-e73c-655f-0278-53bcdeec02c4","constructorName":"Rock","layer":"rocks","rockType":1},{"x":2746.0000610351562,"y":4393.999938964844,"angle":0,"exists":true,"id":"077138f8-600b-810d-9bb4-0f2ff539bdd4","constructorName":"Rock","layer":"rocks","rockType":3},{"x":2301.0000610351562,"y":3965.999755859375,"angle":0,"exists":true,"id":"897cc1e6-687b-e9ab-13ec-4193a341f4e9","constructorName":"Rock","layer":"rocks","rockType":2},{"x":2628.0001831054688,"y":4738.999938964844,"angle":0,"exists":true,"id":"b11e84b9-ca7b-fa9c-7190-3d70771a67fb","constructorName":"Rock","layer":"rocks","rockType":2},{"x":3363.0001831054688,"y":4842.9998779296875,"angle":0,"exists":true,"id":"0f4e78ae-0032-1298-33a6-a115ea5b3664","constructorName":"Rock","layer":"rocks","rockType":1},{"x":4515,"y":5360,"angle":0,"exists":true,"id":"b201e590-1d31-e693-2ad6-d5608551362f","constructorName":"Rock","layer":"rocks","rockType":2},{"x":5585.999755859375,"y":7377.9998779296875,"angle":-55.74625089044366,"exists":true,"id":"a5fe9608-3f50-5725-59ac-c6789478c0ce","constructorName":"Rock","layer":"rocks","rockType":2},{"x":5478.00048828125,"y":7079.000244140625,"angle":-155.0674613505135,"exists":true,"id":"6f561367-0a12-d43b-ca29-33b502f3917e","constructorName":"Rock","layer":"rocks","rockType":1},{"x":4598.999938964844,"y":7381.99951171875,"angle":12.882544633858146,"exists":true,"id":"d3b157bc-9d42-fc78-1d50-91b570c168c1","constructorName":"Rock","layer":"rocks","rockType":3},{"x":4658.000183105469,"y":7164.000244140625,"angle":27.475416895902356,"exists":true,"id":"f12cd116-9694-5460-c25c-4062c9535f66","constructorName":"Rock","layer":"rocks","rockType":3},{"x":4738.999938964844,"y":6959.000244140625,"angle":52.349084103395796,"exists":true,"id":"3f891c55-60ec-3552-0d18-acf6c6dc8d95","constructorName":"Rock","layer":"rocks","rockType":3},{"x":4317.9998779296875,"y":6259.000244140625,"angle":0,"exists":true,"id":"908a2cb4-0481-8858-1299-a0fd300cb56f","constructorName":"Rock","layer":"rocks","rockType":1},{"x":5010,"y":6278.9996337890625,"angle":-51.51605973752726,"exists":true,"id":"42f59915-e6a0-ed4e-ccdb-9e256823565b","constructorName":"Rock","layer":"rocks","rockType":1},{"x":4632.0001220703125,"y":6275,"angle":1.2653681547000133,"exists":true,"id":"13e94097-5fc4-b746-f639-4db213194123","constructorName":"Rock","layer":"rocks","rockType":2},{"x":4382.9998779296875,"y":6070,"angle":0,"exists":true,"id":"a5d4e0be-083a-72a4-ee6f-410548601e81","constructorName":"Food","layer":"powerUps"},{"x":4062,"y":6505,"angle":0,"exists":true,"id":"40c2729b-7bc9-c61d-3e80-65bd090a4f28","constructorName":"Food","layer":"powerUps"},{"x":3473.9999389648438,"y":6917.9998779296875,"angle":56.414782263745366,"exists":true,"id":"cfda5cff-2f93-e5a1-b644-2bcad05c8311","constructorName":"Rock","layer":"rocks","rockType":3},{"x":3255,"y":7109.000244140625,"angle":0,"exists":true,"id":"ce0b236c-995f-7fdf-7742-a1a9414928bc","constructorName":"Rock","layer":"rocks","rockType":2},{"x":5604,"y":5432,"angle":0,"exists":true,"id":"14a88232-38b4-8c81-13b0-6cdd903ada54","constructorName":"Rock","layer":"rocks","rockType":2},{"x":4971.0003662109375,"y":4676.999816894531,"angle":49.53837577938046,"exists":true,"id":"ffc73830-e181-488b-488b-1de5eaffcbf4","constructorName":"Rock","layer":"rocks","rockType":2},{"x":3243.9999389648438,"y":4347.0001220703125,"angle":0,"exists":true,"id":"d76df5cd-39bd-9026-387f-c9508710d531","constructorName":"IceArea","layer":"areas","pointArray":"[[-90,-258.99993896484375],[103.99993896484375,-378.99993896484375],[555,-318.99993896484375],[758.0001831054688,21.00006103515625],[575,436.00006103515625],[153.99993896484375,391.00006103515625],[0,200],[-187.9998779296875,97.9998779296875]]"},{"x":3954.9996948242188,"y":2148.5000610351562,"angle":-31.59878777581008,"exists":true,"id":"5e065845-af5c-0e78-f45d-66452747af6b","constructorName":"Thorn","layer":"rocks","thornType":2},{"x":2827.9998779296875,"y":1436.5000915527344,"angle":165.7413958681782,"exists":true,"id":"93f3a986-8f06-0a8a-6c2b-ec3bfd83a580","constructorName":"Thorn","layer":"rocks","thornType":1},{"x":3295,"y":1114.5000457763672,"angle":-159.22073992521877,"exists":true,"id":"7d924475-8658-626e-f323-f0b463fe985b","constructorName":"Thorn","layer":"rocks","thornType":2},{"x":4151.999816894531,"y":1356.4999389648438,"angle":-107.28805571402268,"exists":true,"id":"048b86d3-9c37-976e-0e3c-32f545cd5be2","constructorName":"Thorn","layer":"rocks","thornType":2},{"x":4888.000183105469,"y":1286.4999389648438,"angle":172.98906594397738,"exists":true,"id":"d81e4fae-af30-c767-4fdf-54189b5dc0af","constructorName":"Thorn","layer":"rocks","thornType":1},{"x":4421.999816894531,"y":1308.5000610351562,"angle":126.85991544285747,"exists":true,"id":"9746dce5-5ff2-b649-6b69-049c210fb0f8","constructorName":"Thorn","layer":"rocks","thornType":1},{"x":5387.0001220703125,"y":1571.5000915527344,"angle":-63.60928874650682,"exists":true,"id":"1c88aa05-d6d9-c6a0-de87-f98882938446","constructorName":"Thorn","layer":"rocks","thornType":1},{"x":2773.9999389648438,"y":2407.5,"angle":-55.76089917344734,"exists":true,"id":"ba69ee00-61f9-70b5-02e6-0293bf829ef9","constructorName":"Thorn","layer":"rocks","thornType":1},{"x":2324.0000915527344,"y":891.5000152587891,"angle":168.92720527720667,"exists":true,"id":"477b3b2c-b39a-d3d9-a64c-51dd7e1b5c0e","constructorName":"Thorn","layer":"rocks","thornType":1},{"x":1419.0000915527344,"y":1082.5000762939453,"angle":-52.449290311616906,"exists":true,"id":"ed44e7e2-ccc9-97d0-6ee9-cf9d546954ac","constructorName":"Thorn","layer":"rocks","thornType":1},{"x":1418.9999389648438,"y":1250.4999542236328,"angle":0,"exists":true,"id":"a33031f8-e478-e766-3759-e83e40ec4e2d","constructorName":"Mutation","layer":"powerUps"},{"x":35.999999046325684,"y":1500.5000305175781,"angle":91.28630995871794,"exists":true,"id":"81014a13-7a2b-4bf2-06c2-72afff31688a","constructorName":"Thorn","layer":"rocks","thornType":2},{"x":31.000001430511475,"y":1344.4999694824219,"angle":89.32712445385187,"exists":true,"id":"be87ad20-ae3f-af24-8939-fe6e0ff0e0e1","constructorName":"Thorn","layer":"rocks","thornType":1},{"x":1470.0001525878906,"y":1764.4999694824219,"angle":-10.390814258545277,"exists":true,"id":"8775eccc-7310-4b16-ad6b-777a4b94d064","constructorName":"Thorn","layer":"rocks","thornType":1},{"x":2746.0000610351562,"y":2025.5000305175781,"angle":-57.72638521788889,"exists":true,"id":"b079b018-924c-b3e5-d58f-c6578382198f","constructorName":"Thorn","layer":"rocks","thornType":2},{"x":4418.999938964844,"y":3124.5001220703125,"angle":-25.89998780010569,"exists":true,"id":"c2bfedc2-1ace-8c59-e432-7c1387d31e8b","constructorName":"Thorn","layer":"rocks","thornType":2},{"x":4621.999816894531,"y":4473.5003662109375,"angle":82.5098060209109,"exists":true,"id":"357df345-5f0e-2a22-7f63-c5422f8662c6","constructorName":"Rock","layer":"rocks","rockType":2},{"x":5302.9998779296875,"y":4636.500244140625,"angle":50.87754949657784,"exists":true,"id":"2f412f08-1735-8b32-a26a-16f9f0a221c9","constructorName":"Rock","layer":"rocks","rockType":1},{"x":5404.000244140625,"y":4273.5003662109375,"angle":-117.77313785994079,"exists":true,"id":"2a55c79a-6327-9a6e-2153-d082188c5b2f","constructorName":"Rock","layer":"rocks","rockType":1},{"x":4865,"y":3927.5,"angle":29.912237801623633,"exists":true,"id":"9c0dddcb-826d-e424-9201-d8fd8b929cd2","constructorName":"Rock","layer":"rocks","rockType":2},{"x":5218.9996337890625,"y":3976.4996337890625,"angle":58.46920177173695,"exists":true,"id":"d5d53010-e1af-19b5-2f82-156d668cb505","constructorName":"Rock","layer":"rocks","rockType":2},{"x":4803.999938964844,"y":4192.500305175781,"angle":0,"exists":true,"id":"6977309c-cc84-2791-6df7-369fe9e80822","constructorName":"Mutation","layer":"powerUps"},{"x":4880,"y":4324.5001220703125,"angle":0,"exists":true,"id":"5a0b5090-8fab-f341-5aaf-29221d2b05c3","constructorName":"Mutation","layer":"powerUps"},{"x":4996.000061035156,"y":4249.499816894531,"angle":0,"exists":true,"id":"535969f0-cb2d-9496-1f7c-7b6a31f1e5ba","constructorName":"Food","layer":"powerUps"},{"x":4962.0001220703125,"y":4345.4998779296875,"angle":0,"exists":true,"id":"dbc51c26-71ad-1566-8558-f44fa01cb2ba","constructorName":"Food","layer":"powerUps"},{"x":5046.000061035156,"y":4335.500183105469,"angle":0,"exists":true,"id":"44a7600b-844f-25b6-e8da-bb1d31e9bc75","constructorName":"Food","layer":"powerUps"},{"x":5085,"y":4173.500061035156,"angle":0,"exists":true,"id":"0e6a1d33-3958-2a7c-8cf9-853135df67a2","constructorName":"Food","layer":"powerUps"},{"x":5125,"y":4292.5,"angle":0,"exists":true,"id":"ac896d97-9752-32a0-b8d1-0c4e7f1644c4","constructorName":"Food","layer":"powerUps"},{"x":5106.999816894531,"y":4392.5,"angle":0,"exists":true,"id":"648fdc37-cde0-5f46-bced-6b5dadeae999","constructorName":"Food","layer":"powerUps"},{"x":4891.999816894531,"y":4498.500061035156,"angle":-11.98843386710692,"exists":true,"id":"3e08daf3-6c5e-5eaa-22a1-e0665a4dd0be","constructorName":"Thorn","layer":"rocks","thornType":2},{"x":5041.000061035156,"y":4486.499938964844,"angle":23.22662227295021,"exists":true,"id":"6644b529-200c-ab0f-029e-ff90c64aef4b","constructorName":"Thorn","layer":"rocks","thornType":2},{"x":5240.999755859375,"y":4445.4998779296875,"angle":-50.9149717017242,"exists":true,"id":"73bd564d-2e72-4f42-62f5-87ee9ec5f18b","constructorName":"Thorn","layer":"rocks","thornType":1},{"x":5283.9996337890625,"y":4273.500061035156,"angle":-103.87618688554136,"exists":true,"id":"7c8aa58a-2203-e64b-18e6-795c86cd1083","constructorName":"Thorn","layer":"rocks","thornType":1},{"x":5142.0001220703125,"y":4117.5,"angle":-148.73403449450552,"exists":true,"id":"ef08df0f-f054-9a05-01e7-f4793160998a","constructorName":"Thorn","layer":"rocks","thornType":2},{"x":4995,"y":4085.4998779296875,"angle":175.54284946346024,"exists":true,"id":"fa97e333-8131-c9ea-8baf-ae9b4cad393c","constructorName":"Thorn","layer":"rocks","thornType":2},{"x":4815,"y":4084.5001220703125,"angle":-176.2472863974865,"exists":true,"id":"132cb841-dcf9-fcb8-0754-594ba476239b","constructorName":"Thorn","layer":"rocks","thornType":2},{"x":4785.000305175781,"y":4390.4998779296875,"angle":60.09786226050633,"exists":true,"id":"6a4ddeef-df32-ae1a-6c15-f78065a2b564","constructorName":"Thorn","layer":"rocks","thornType":1},{"x":4671.000061035156,"y":4286.499938964844,"angle":30.12861069920737,"exists":true,"id":"e90b8bee-4828-962c-2eca-ea69fdd43aaf","constructorName":"Thorn","layer":"rocks","thornType":2},{"x":4207.9998779296875,"y":1700.5000305175781,"angle":0,"exists":true,"id":"ee1400df-6fe1-cb7f-7350-1a0d9a14f4d7","constructorName":"Pebble","layer":"rocks"},{"x":5210,"y":1104.5000457763672,"angle":0,"exists":true,"id":"a9853c68-eaac-b003-c791-06049b292b36","constructorName":"Pebble","layer":"rocks"},{"x":2950,"y":941.5000152587891,"angle":0,"exists":true,"id":"15178044-7ba5-c048-f5c1-dabd9122a8df","constructorName":"Pebble","layer":"rocks"},{"x":614.0000152587891,"y":1583.4999084472656,"angle":0,"exists":true,"id":"27b286b3-b9e4-d0f2-7d86-f408d207c9b1","constructorName":"Pebble","layer":"rocks"},{"x":1104.000015258789,"y":2688.5000610351562,"angle":0,"exists":true,"id":"29d8fcde-6dc8-5749-7045-c57b0fe895f8","constructorName":"Pebble","layer":"rocks"},{"x":1590.9999084472656,"y":3340.5001831054688,"angle":0,"exists":true,"id":"7e71515b-33bc-d4eb-e877-517449c5ad5b","constructorName":"Pebble","layer":"rocks"},{"x":2646.9998168945312,"y":3841.4999389648438,"angle":0,"exists":true,"id":"36209e95-788c-ad43-5cff-25ee7b1c742f","constructorName":"Pebble","layer":"rocks"},{"x":1498.0000305175781,"y":4204.5001220703125,"angle":0,"exists":true,"id":"f424bd1f-85d1-dfec-71bb-334a14c02b0d","constructorName":"Rock","layer":"rocks","rockType":2},{"x":1131.9999694824219,"y":4328.500061035156,"angle":0,"exists":true,"id":"baf65453-2c94-0797-cda5-b0a214b812f8","constructorName":"Rock","layer":"rocks","rockType":1},{"x":923.0000305175781,"y":4614.499816894531,"angle":0,"exists":true,"id":"6168ca59-75e1-49ac-bf0a-3d54be18c031","constructorName":"Rock","layer":"rocks","rockType":2},{"x":690,"y":4902.5,"angle":-23.39261965874971,"exists":true,"id":"b15d235a-8c8e-ada9-d339-08046069a905","constructorName":"Rock","layer":"rocks","rockType":2},{"x":544.0000152587891,"y":5199.5001220703125,"angle":42.18528698694368,"exists":true,"id":"2a881760-873c-e840-e5f4-0e3555337149","constructorName":"Rock","layer":"rocks","rockType":3},{"x":816.9999694824219,"y":4307.5,"angle":0,"exists":true,"id":"c0bda5ec-8829-24cc-ab43-83a5d445b5d9","constructorName":"Pebble","layer":"rocks"},{"x":879.0000152587891,"y":4048.5000610351562,"angle":0,"exists":true,"id":"e31ce84e-e6e0-dba5-3ce4-8ba2e75c54ca","constructorName":"Pebble","layer":"rocks"},{"x":678.1427001953125,"y":3918.7667846679688,"angle":0,"exists":true,"id":"95eb1c46-4a53-3655-3dee-88540518bc1b","constructorName":"Pebble","layer":"rocks"},{"x":602.0000076293945,"y":4067.5,"angle":0,"exists":true,"id":"c158e12c-bb94-5ddc-c8a9-013418a7a89d","constructorName":"Pebble","layer":"rocks"},{"x":637.9999923706055,"y":4254.499816894531,"angle":0,"exists":true,"id":"95583d20-32c4-a94f-1e16-af8b190e9140","constructorName":"Pebble","layer":"rocks"},{"x":374.00001525878906,"y":4058.5000610351562,"angle":0,"exists":true,"id":"806a4023-2611-3553-4410-48eeb728927d","constructorName":"Pebble","layer":"rocks"},{"x":599.8636245727539,"y":4434.7308349609375,"angle":0,"exists":true,"id":"6a6170bb-b184-fe72-38b0-91a22c3036cb","constructorName":"Pebble","layer":"rocks"},{"x":801.9999694824219,"y":3964.5001220703125,"angle":0,"exists":true,"id":"6873ad04-c7a3-0a00-01aa-ca340a2ab84b","constructorName":"Food","layer":"powerUps"},{"x":780.9999847412109,"y":4155.500183105469,"angle":0,"exists":true,"id":"282e08b6-d22a-4a57-8690-014a288f078b","constructorName":"Food","layer":"powerUps"},{"x":527.0000076293945,"y":4391.499938964844,"angle":0,"exists":true,"id":"e5aa3fff-38a8-2180-414c-db23cf77da30","constructorName":"Food","layer":"powerUps"},{"x":465,"y":4203.500061035156,"angle":0,"exists":true,"id":"97c0f5e4-91b3-1e62-d9c2-58fa497143a0","constructorName":"Food","layer":"powerUps"},{"x":293.99999618530273,"y":4269.499816894531,"angle":0,"exists":true,"id":"a32f1e22-0662-a189-35b0-54babf723fd1","constructorName":"Food","layer":"powerUps"},{"x":475.99998474121094,"y":4572.5,"angle":0,"exists":true,"id":"b0e18b8c-e55d-da25-2af8-4ccb71e6078f","constructorName":"Food","layer":"powerUps"}]
};