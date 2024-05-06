const readlineSync = require("readline-sync");
const fs = require("fs");
const delay = require("delay");
var fetch = require("node-fetch");
var chalk = require("chalk");
const {
    table
} = require('table');
const Axios = require('axios')
const path = require('path');
var random = require('random-name');
const cluster = require("cluster");
var UserAgent = require("user-agents");
const userAgent = new UserAgent();

function getBearer() {
    const index = fetch('https://abs.twimg.com/responsive-web/client-serviceworker/serviceworker.44a62435.js', {
            headers: {
                'Host': 'abs.twimg.com',
                'User-Agent': userAgent.toString(),
                'Accept': '*/*',
                'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
                'Origin': 'https://twitter.com',
                'Referer': 'https://twitter.com/',
                'Sec-Fetch-Dest': 'script',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site',
                'Te': 'trailers'
            }
        })

        .then(async (res) => {
            const data = await res.text();
            var bearer = data.match('Bearer(.*)content-type')[1]
            var bearer = bearer.replace('"),"', '');
            var bearer = bearer.replace(' ".concat("', '');
            return bearer;
        });

    return index;
}

function guestId() {
    let options = {};
    const index = fetch('https://twitter.com/', {
            headers: {
                'Host': 'twitter.com',
                'User-Agent': userAgent.toString(),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Te': 'trailers',
                'Connection': 'close'
            },

            redirect: "manual"
        })

        .then(async (res) => {
            const data = await res.text();
            headers = res.headers.raw()['set-cookie']

            try {
                if (headers[0].match('guest_id')) {
                    var guest_id = headers[0].split(';')[0].split('=')[1];;
                } else if (headers[1].match('guest_id')) {
                    var guest_id = headers[1].split(';')[0].split('=')[1];;
                } else if (headers[2].match('guest_id')) {
                    var guest_id = headers[2].split(';')[0].split('=')[1];;
                } else if (headers[3].match('guest_id')) {
                    var guest_id = headers[3].split(';')[0].split('=')[1];;
                }
            } catch (err) {

            }

            return guest_id;
        });

    return index;
}

function guestToken(guestid) {
    const index = fetch('https://twitter.com/', {
            headers: {
                'Host': 'twitter.com',
                'User-Agent': userAgent.toString(),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Te': 'trailers',
                'Connection': 'close',
                'Cookie': 'guest_id=' + guestid + ''
            },

            redirect: "manual"
        })

        .then(async (res) => {
            const data = await res.text();
            headers = res.headers.raw()['set-cookie']

            try {
                var token = data.match('"gt=(.*); Max-Age=')[1];
            } catch (err) {

            }
            return token;
        });

    return index;
}

const step1 = (bearer, guesttoken, guestId) => new Promise((resolve, reject) => {
    const index = fetch('https://api.twitter.com/1.1/onboarding/task.json?flow_name=login', {
            method: 'POST',
            headers: {
                'Host': 'api.twitter.com',
                'User-Agent': userAgent.toString(),
                'Accept': '*/*',
                'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearer + '',
                'X-Guest-Token': '' + guesttoken + '',
                'X-Twitter-Client-Language': 'id',
                'X-Twitter-Active-User': 'yes',
                'X-Csrf-Token': '5e992c84705f9dade287b1bedf57acfa',
                'Content-Length': '924',
                'Origin': 'https://twitter.com',
                'Referer': 'https://twitter.com/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'Te': 'trailers',
                'Cookie': 'guest_id_marketing=' + guestId + '; guest_id_ads=' + guestId + '; personalization_id="v1_sg9Yj0h38S5d2odQ3QjrbA=="; guest_id=' + guestId + '; gt=1628249122804473858; ct0=5e992c84705f9dade287b1bedf57acfa; _ga=GA1.2.1496126669.1677039824; _gid=GA1.2.2120338793.1677039824'
            },
            body: JSON.stringify({
                'input_flow_data': {
                    'flow_context': {
                        'debug_overrides': {},
                        'start_location': {
                            'location': 'unknown'
                        }
                    }
                },
                'subtask_versions': {
                    'action_list': 2,
                    'alert_dialog': 1,
                    'app_download_cta': 1,
                    'check_logged_in_account': 1,
                    'choice_selection': 3,
                    'contacts_live_sync_permission_prompt': 0,
                    'cta': 7,
                    'email_verification': 2,
                    'end_flow': 1,
                    'enter_date': 1,
                    'enter_email': 2,
                    'enter_password': 5,
                    'enter_phone': 2,
                    'enter_recaptcha': 1,
                    'enter_text': 5,
                    'enter_username': 2,
                    'generic_urt': 3,
                    'in_app_notification': 1,
                    'interest_picker': 3,
                    'js_instrumentation': 1,
                    'menu_dialog': 1,
                    'notifications_permission_prompt': 2,
                    'open_account': 2,
                    'open_home_timeline': 1,
                    'open_link': 1,
                    'phone_verification': 4,
                    'privacy_options': 1,
                    'security_key': 3,
                    'select_avatar': 4,
                    'select_banner': 2,
                    'settings_list': 7,
                    'show_code': 1,
                    'sign_up': 2,
                    'sign_up_review': 4,
                    'tweet_selection_urt': 1,
                    'update_users': 1,
                    'upload_media': 1,
                    'user_recommendations_list': 4,
                    'user_recommendations_urt': 1,
                    'wait_spinner': 3,
                    'web_modal': 1
                }
            })
        })

        .then(async (res) => {
            const data = await res.json();
            headers = res.headers.raw()['set-cookie'];
            var att = headers[0].split(';')[0].split('=')[1];;
            const flow = data.flow_token;
            resolve({
                data,
                flow,
                att
            })
        });

    return index;
});

const response = (guestid) => new Promise((resolve, reject) => {
    const index = fetch('https://twitter.com/i/js_inst?c_name=ui_metrics', {
            headers: {
                'Host': 'twitter.com',
                'User-Agent': userAgent.toString(),
                'Accept': '*/*',
                'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
                'Accept-Encoding': 'gzip, deflate',
                'Referer': 'https://twitter.com/i/flow/login',
                'Sec-Fetch-Dest': 'script',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Site': 'same-origin',
                'Te': 'trailers',
                'Cookie': 'guest_id_marketing=' + guestid + '; guest_id_ads=' + guestid + '; personalization_id="v1_sg9Yj0h38S5d2odQ3QjrbA=="; guest_id=' + guestid + '; gt=1628249122804473858; ct0=5e992c84705f9dade287b1bedf57acfa; _ga=GA1.2.1496126669.1677039824; _gid=GA1.2.2120338793.1677039824; att=1-o5uh9GBgKcwFFtwa4BywAulFvSIEATwHVOQlSygf'
            }
        })

        .then(async (res) => {
            const data = await res.text();
            var var1 = [...data.matchAll('var (.*?)=')][1][0];
            var var1 = var1.replace('var ', '');
            var var1 = var1.replace('=', '');
            var var2 = [...data.matchAll('var (.*?)=')][2][0];
            var var2 = var2.replace('var ', '');
            var var2 = var2.replace('=', '');
            var var3 = [...data.matchAll('var (.*?)=')][3][0];
            var var3 = var3.replace('var ', '');
            var var3 = var3.replace('=', '');
            var var4 = [...data.matchAll('var (.*?)=')][4][0];
            var var4 = var4.replace('var ', '');
            var var4 = var4.replace('=', '');
            var s = data.match("'s':'(.*?'};)")[1];
            var s = s.replace("'};", '');
            resolve({
                data,
                var1,
                var2,
                var3,
                var4,
                s
            });
        });

    return index;
});

function flowStep2(bearer, guesttoken, guestId, flowStep1, var1, var2, var3, var4, s, att) {
    const index = fetch('https://api.twitter.com/1.1/onboarding/task.json', {
            method: 'POST',
            headers: {
                'Host': 'api.twitter.com',
                'User-Agent': userAgent.toString(),
                'Accept': '*/*',
                'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearer + '',
                'X-Guest-Token': '' + guesttoken + '',
                'X-Twitter-Client-Language': 'id',
                'X-Twitter-Active-User': 'yes',
                'X-Csrf-Token': '5e992c84705f9dade287b1bedf57acfa',
                'Origin': 'https://twitter.com',
                'Referer': 'https://twitter.com/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'Te': 'trailers',
                'Cookie': 'guest_id_marketing=' + guestId + '; guest_id_ads=' + guestId + '; personalization_id="v1_sg9Yj0h38S5d2odQ3QjrbA=="; guest_id=' + guestId + '; gt=1628249122804473858; ct0=5e992c84705f9dade287b1bedf57acfa; _ga=GA1.2.1496126669.1677039824; _gid=GA1.2.2120338793.1677039824; att=' + att + '; _twitter_sess=BAh7CSIKZmxhc2hJQzonQWN0aW9uQ29udHJvbGxlcjo6Rmxhc2g6OkZsYXNo%250ASGFzaHsABjoKQHVzZWR7ADoPY3JlYXRlZF9hdGwrCEz8XHeGAToMY3NyZl9p%250AZCIlYzg3Mzc3ZDMxYmJjNzY2Y2IxM2E0YjM3NDZjYWZiMzc6B2lkIiU1OGQ3%250AOTYzOWQ2NjI1NDNmN2ExYTAzMmM4ZWQ1MDI3MA%253D%253D--c66e5ed4bf27afa93c30e7c0ca84e142614af2ea'
            },
            body: JSON.stringify({
                'flow_token': '' + flowStep1 + '',
                'subtask_inputs': [{
                    'subtask_id': 'LoginJsInstrumentationSubtask',
                    'js_instrumentation': {
                        'response': '{"rf":{"' + var1 + '":-96,"' + var2 + '":-171,"' + var3 + '":-153,"' + var4 + '":50},"s":"' + s + '"}',
                        'link': 'next_link'
                    }
                }]
            })
        })

        .then(async (res) => {
            const data = await res.json();
            return data;
        });

    return index;
}

function login(bearer, guesttoken, guestid, flowStep2, att, usernameAkun) {
    const index = fetch('https://api.twitter.com/1.1/onboarding/task.json', {
            method: 'POST',
            headers: {
                'Host': 'api.twitter.com',
                'User-Agent': userAgent.toString(),
                'Accept': '*/*',
                'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
                'Content-Type': 'application/json',
                'Referer': 'https://twitter.com/',
                'X-Guest-Token': '' + guesttoken + '',
                'X-Twitter-Client-Language': 'id',
                'X-Twitter-Active-User': 'yes',
                'X-Csrf-Token': '5e992c84705f9dade287b1bedf57acfa',
                'Origin': 'https://twitter.com',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'Authorization': 'Bearer ' + bearer + '',
                'Te': 'trailers',
                'Cookie': 'guest_id_marketing=' + guestid + '; guest_id_ads=' + guestid + '; personalization_id="v1_sg9Yj0h38S5d2odQ3QjrbA=="; guest_id=' + guestid + '; gt=1628249122804473858; ct0=5e992c84705f9dade287b1bedf57acfa; _ga=GA1.2.1496126669.1677039824; _gid=GA1.2.2120338793.1677039824; att=' + att + '; _twitter_sess=BAh7CSIKZmxhc2hJQzonQWN0aW9uQ29udHJvbGxlcjo6Rmxhc2g6OkZsYXNo%250ASGFzaHsABjoKQHVzZWR7ADoPY3JlYXRlZF9hdGwrCEz8XHeGAToMY3NyZl9p%250AZCIlYzg3Mzc3ZDMxYmJjNzY2Y2IxM2E0YjM3NDZjYWZiMzc6B2lkIiU1OGQ3%250AOTYzOWQ2NjI1NDNmN2ExYTAzMmM4ZWQ1MDI3MA%253D%253D--c66e5ed4bf27afa93c30e7c0ca84e142614af2ea'
            },
            body: JSON.stringify({
                'flow_token': '' + flowStep2 + '',
                'subtask_inputs': [{
                    'subtask_id': 'LoginEnterUserIdentifierSSO',
                    'settings_list': {
                        'setting_responses': [{
                            'key': 'user_identifier',
                            'response_data': {
                                'text_data': {
                                    'result': '' + usernameAkun + ''
                                }
                            }
                        }],
                        'link': 'next_link'
                    }
                }]
            })
        })

        .then(async (res) => {
            const data = await res.json();
            var flow = data.flow_token;
            return flow;
        });

    return index;
}

const loginPassword = (bearer, guesttoken, guestid, flowStep3, att, password) => new Promise((resolve, reject) => {
    const index = fetch('https://api.twitter.com/1.1/onboarding/task.json', {
            method: 'POST',
            headers: {
                'Host': 'api.twitter.com',
                'User-Agent': userAgent.toString(),
                'Accept': '*/*',
                'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
                'Content-Type': 'application/json',
                'Referer': 'https://twitter.com/',
                'X-Guest-Token': '' + guesttoken + '',
                'X-Twitter-Client-Language': 'id',
                'X-Twitter-Active-User': 'yes',
                'X-Csrf-Token': '5e992c84705f9dade287b1bedf57acfa',
                'Origin': 'https://twitter.com',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'Authorization': 'Bearer ' + bearer + '',
                'Te': 'trailers',
                'Cookie': 'guest_id_marketing=' + guestid + '; guest_id_ads=' + guestid + '; personalization_id="v1_sg9Yj0h38S5d2odQ3QjrbA=="; guest_id=' + guestid + '; gt=1628249122804473858; ct0=5e992c84705f9dade287b1bedf57acfa; _ga=GA1.2.1496126669.1677039824; _gid=GA1.2.2120338793.1677039824; att=' + att + '; _twitter_sess=BAh7CSIKZmxhc2hJQzonQWN0aW9uQ29udHJvbGxlcjo6Rmxhc2g6OkZsYXNo%250ASGFzaHsABjoKQHVzZWR7ADoPY3JlYXRlZF9hdGwrCEz8XHeGAToMY3NyZl9p%250AZCIlYzg3Mzc3ZDMxYmJjNzY2Y2IxM2E0YjM3NDZjYWZiMzc6B2lkIiU1OGQ3%250AOTYzOWQ2NjI1NDNmN2ExYTAzMmM4ZWQ1MDI3MA%253D%253D--c66e5ed4bf27afa93c30e7c0ca84e142614af2ea'
            },
            body: JSON.stringify({
                'flow_token': '' + flowStep3 + '',
                'subtask_inputs': [{
                    'subtask_id': 'LoginEnterPassword',
                    'enter_password': {
                        'password': '' + password + '',
                        'link': 'next_link'
                    }
                }]
            })
        })

        .then(async (res) => {
            const data = await res.json();
            headers = res.headers.raw();
            resolve({
                data,
                headers
            })
        });

    return index;
});


const getFlow4 = (bearer, guesttoken, guestid, flowStep4, att) => new Promise((resolve, reject) => {
    const index = fetch('https://api.twitter.com/1.1/onboarding/task.json', {
            method: 'POST',
            headers: {
                'Host': 'api.twitter.com',
                'User-Agent': userAgent.toString(),
                'Accept': '*/*',
                'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
                'Content-Type': 'application/json',
                'Referer': 'https://twitter.com/',
                'X-Guest-Token': '' + guesttoken + '',
                'X-Twitter-Client-Language': 'id',
                'X-Twitter-Active-User': 'yes',
                'X-Csrf-Token': '5e992c84705f9dade287b1bedf57acfa',
                'Origin': 'https://twitter.com',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'Authorization': 'Bearer ' + bearer + '',
                'Te': 'trailers',
                'Cookie': 'guest_id_marketing=' + guestid + '; guest_id_ads=' + guestid + '; personalization_id="v1_sg9Yj0h38S5d2odQ3QjrbA=="; guest_id=' + guestid + '; gt=1628249122804473858; ct0=5e992c84705f9dade287b1bedf57acfa; _ga=GA1.2.1496126669.1677039824; _gid=GA1.2.2120338793.1677039824; att=' + att + '; _twitter_sess=BAh7CSIKZmxhc2hJQzonQWN0aW9uQ29udHJvbGxlcjo6Rmxhc2g6OkZsYXNo%250ASGFzaHsABjoKQHVzZWR7ADoPY3JlYXRlZF9hdGwrCEz8XHeGAToMY3NyZl9p%250AZCIlYzg3Mzc3ZDMxYmJjNzY2Y2IxM2E0YjM3NDZjYWZiMzc6B2lkIiU1OGQ3%250AOTYzOWQ2NjI1NDNmN2ExYTAzMmM4ZWQ1MDI3MA%253D%253D--c66e5ed4bf27afa93c30e7c0ca84e142614af2ea'
            },
            body: JSON.stringify({
                'flow_token': '' + flowStep4 + '',
                'subtask_inputs': [{
                    'subtask_id': 'AccountDuplicationCheck',
                    'check_logged_in_account': {
                        'link': 'AccountDuplicationCheck_false'
                    }
                }]
            })
        })

        .then(async (res) => {
            const data = await res.json();
            headers = res.headers.raw()['set-cookie'];
            try {
                if (headers[0].match('kdt')) {
                    var kdt = headers[0].split(';')[0].split('=')[1];;
                } else if (headers[1].match('kdt')) {
                    var kdt = headers[1].split(';')[0].split('=')[1];;
                } else if (headers[2].match('kdt')) {
                    var kdt = headers[2].split(';')[0].split('=')[1];;
                } else if (headers[3].match('kdt')) {
                    var kdt = headers[3].split(';')[0].split('=')[1];;
                }
            } catch (err) {

            }

            try {
                if (headers[0].match('twid')) {
                    var twid = headers[0].split(';')[0];
                } else if (headers[1].match('twid')) {
                    var twid = headers[1].split(';')[0];
                } else if (headers[2].match('twid')) {
                    var twid = headers[2].split(';')[0];
                } else if (headers[3].match('twid')) {
                    var twid = headers[3].split(';')[0];
                }
            } catch (err) {

            }

            try {
                if (headers[0].match('att')) {
                    var att = headers[0].split(';')[0].split('=')[1];;
                } else if (headers[1].match('att')) {
                    var att = headers[1].split(';')[0].split('=')[1];;
                } else if (headers[2].match('att')) {
                    var att = headers[2].split(';')[0].split('=')[1];;
                } else if (headers[3].match('att')) {
                    var att = headers[3].split(';')[0].split('=')[1];;
                }
            } catch (err) {

            }

            try {
                if (headers[0].match('auth_token')) {
                    var auth_token = headers[0].split(';')[0].split('=')[1];;
                } else if (headers[1].match('auth_token')) {
                    var auth_token = headers[1].split(';')[0].split('=')[1];;
                } else if (headers[2].match('auth_token')) {
                    var auth_token = headers[2].split(';')[0].split('=')[1];;
                } else if (headers[3].match('auth_token')) {
                    var auth_token = headers[3].split(';')[0].split('=')[1];;
                }
            } catch (err) {

            }
            resolve({
                data,
                headers,
                kdt,
                twid,
                att,
                auth_token
            })
        });

    return index;
});

function getCSRF(bearer, guestid, token) {
    const index = fetch('https://api.twitter.com/graphql/QXO9SjUJXid3NNEovZXydw/Viewer?variables=%7B%22withCommunitiesMemberships%22%3Atrue%2C%22withCommunitiesCreation%22%3Atrue%2C%22withSuperFollowsUserFields%22%3Atrue%7D&features=%7B%22responsive_web_twitter_blue_verified_badge_is_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Afalse%2C%22verified_phone_label_enabled%22%3Afalse%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%7D', {
            headers: {
                'Host': 'api.twitter.com',
                'User-Agent': userAgent.toString(),
                'Accept': '*/*',
                'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
                'Accept-Encoding': 'gzip, deflate',
                'Referer': 'https://twitter.com/',
                'Content-Type': 'application/json',
                'X-Guest-Token': '1628249122804473858',
                'X-Twitter-Client-Language': 'id',
                'X-Twitter-Active-User': 'yes',
                'X-Csrf-Token': '013d8cfa8703c3329bf1155dd405b28a',
                'Origin': 'https://twitter.com',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'Authorization': 'Bearer ' + bearer + '',
                'Te': 'trailers',
                'Cookie': 'guest_id_marketing=' + guestid + '; guest_id_ads=' + guestid + '; ct0=013d8cfa8703c3329bf1155dd405b28a; auth_token=' + token + ''
            }
        })
        .then(async (res) => {
            const data = await res.json();
            headers = res.headers.raw()['set-cookie'];

            try {
                if (headers[0].match('ct0')) {
                    var ct0 = headers[0].split(';')[0].split('=')[1];;
                } else if (headers[1].match('ct0')) {
                    var ct0 = headers[1].split(';')[0].split('=')[1];;
                } else if (headers[2].match('ct0')) {
                    var ct0 = headers[2].split(';')[0].split('=')[1];;
                } else if (headers[3].match('ct0')) {
                    var ct0 = headers[3].split(';')[0].split('=')[1];;
                }
            } catch (err) {

            }
            return ct0;
        });

    return index;
}

const getFlow5 = (bearer, guesttoken, guestid, flowStep5, att, email) => new Promise((resolve, reject) => {
    const index = fetch('https://api.twitter.com/1.1/onboarding/task.json', {
            method: 'POST',
            headers: {
                'Host': 'api.twitter.com',
                'User-Agent': userAgent.toString(),
                'Accept': '*/*',
                'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
                'Content-Type': 'application/json',
                'Referer': 'https://twitter.com/',
                'X-Guest-Token': '' + guesttoken + '',
                'X-Twitter-Client-Language': 'id',
                'X-Twitter-Active-User': 'yes',
                'X-Csrf-Token': '5e992c84705f9dade287b1bedf57acfa',
                'Origin': 'https://twitter.com',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'Authorization': 'Bearer ' + bearer + '',
                'Te': 'trailers',
                'Cookie': 'guest_id_marketing=' + guestid + '; guest_id_ads=' + guestid + '; personalization_id="v1_sg9Yj0h38S5d2odQ3QjrbA=="; guest_id=' + guestid + '; gt=1628249122804473858; ct0=5e992c84705f9dade287b1bedf57acfa; _ga=GA1.2.1496126669.1677039824; _gid=GA1.2.2120338793.1677039824; att=' + att + '; _twitter_sess=BAh7CSIKZmxhc2hJQzonQWN0aW9uQ29udHJvbGxlcjo6Rmxhc2g6OkZsYXNo%250ASGFzaHsABjoKQHVzZWR7ADoPY3JlYXRlZF9hdGwrCEz8XHeGAToMY3NyZl9p%250AZCIlYzg3Mzc3ZDMxYmJjNzY2Y2IxM2E0YjM3NDZjYWZiMzc6B2lkIiU1OGQ3%250AOTYzOWQ2NjI1NDNmN2ExYTAzMmM4ZWQ1MDI3MA%253D%253D--c66e5ed4bf27afa93c30e7c0ca84e142614af2ea'
            },
            body: JSON.stringify({
                'flow_token': '' + flowStep5 + '',
                'subtask_inputs': [{
                    'subtask_id': 'LoginAcid',
                    'enter_text': {
                        'text': '' + email + '',
                        'link': 'next_link'
                    }
                }]
            })
        })

        .then(async (res) => {
            const data = await res.json();
            headers = res.headers.raw()['set-cookie'];
            try {
                if (headers[0].match('kdt')) {
                    var kdt = headers[0].split(';')[0].split('=')[1];;
                } else if (headers[1].match('kdt')) {
                    var kdt = headers[1].split(';')[0].split('=')[1];;
                } else if (headers[2].match('kdt')) {
                    var kdt = headers[2].split(';')[0].split('=')[1];;
                } else if (headers[3].match('kdt')) {
                    var kdt = headers[3].split(';')[0].split('=')[1];;
                }
            } catch (err) {

            }

            try {
                if (headers[0].match('twid')) {
                    var twid = headers[0].split(';')[0];
                } else if (headers[1].match('twid')) {
                    var twid = headers[1].split(';')[0];
                } else if (headers[2].match('twid')) {
                    var twid = headers[2].split(';')[0];
                } else if (headers[3].match('twid')) {
                    var twid = headers[3].split(';')[0];
                }
            } catch (err) {

            }

            try {
                if (headers[0].match('att')) {
                    var att = headers[0].split(';')[0].split('=')[1];;
                } else if (headers[1].match('att')) {
                    var att = headers[1].split(';')[0].split('=')[1];;
                } else if (headers[2].match('att')) {
                    var att = headers[2].split(';')[0].split('=')[1];;
                } else if (headers[3].match('att')) {
                    var att = headers[3].split(';')[0].split('=')[1];;
                }
            } catch (err) {

            }

            try {
                if (headers[0].match('auth_token')) {
                    var auth_token = headers[0].split(';')[0].split('=')[1];;
                } else if (headers[1].match('auth_token')) {
                    var auth_token = headers[1].split(';')[0].split('=')[1];;
                } else if (headers[2].match('auth_token')) {
                    var auth_token = headers[2].split(';')[0].split('=')[1];;
                } else if (headers[3].match('auth_token')) {
                    var auth_token = headers[3].split(';')[0].split('=')[1];;
                }
            } catch (err) {

            }
            resolve({
                data,
                headers,
                kdt,
                twid,
                att,
                auth_token
            })
        });

    return index;
});

(async () => {
        const read2 = fs.readFileSync('akun.txt', 'UTF-8');
        const list2 = read2.split(/\r?\n/);
        for (var i = 0; i < list2.length; i++) {
            var usernameAkun = list2[i].split('|')[0];
            var password = list2[i].split('|')[1];
            var email = list2[i].split('|')[2];

            var bearer = await getBearer();
            var guestid = await guestId();
            var guesttoken = await guestToken(guestid);

            var flowStep1 = await step1(bearer, guesttoken, guestid);
            var flow1 = flowStep1.flow;
            var att = flowStep1.att;
            var respon = await response(guestid)
            var var1 = respon.var1;
            var var2 = respon.var2;
            var var3 = respon.var3;
            var var4 = respon.var4;
            var s = respon.s;

            const flowLogin = await flowStep2(bearer, guesttoken, guestid, flow1, var1, var2, var3, var4, s, att);
            var flow2 = flowLogin.flow_token;
            var loginAccount = await login(bearer, guesttoken, guestid, flow2, att, usernameAkun);
            var flow3 = loginAccount;
            var loginBosku = await loginPassword(bearer, guesttoken, guestid, flow3, att, password);
            var status = loginBosku.data.status;
            var flow4 = loginBosku.data.flow_token;
            var subtask = loginBosku.data.subtasks;
            console.log()
            if (status == "success") {
                console.log(chalk.white('[') + chalk.green('!') + chalk.white(']') + ` Information  => ` + chalk.yellow(`${usernameAkun} | ${password} Successfully Login`))
            } else {
                console.log(chalk.white('[') + chalk.green('!') + chalk.white(']') + ` Information  => ` + chalk.yellow(`${usernameAkun} | ${password} Failure Login`))
            }

            var getCookie = await getFlow4(bearer, guesttoken, guestid, flow4, att);
            var substask = getCookie.data.subtasks[0].subtask_id;
            if (substask == "LoginSuccessSubtask") {
                console.log(chalk.white('[') + chalk.green('!') + chalk.white(']') + ` Information  => ` + chalk.yellow(`${usernameAkun} | ${password} Successfully Get Cookie\n`))
                const csrf = await getCSRF(bearer, guestid, getCookie.auth_token);
                fs.appendFileSync("cookieAkunbaru.txt", getCookie.auth_token + "|" + csrf + "\n");
            } else if (substask == "LoginAcid") {
                var info = getCookie.data.subtasks[0].enter_text.header.secondary_text.text;
                console.log(chalk.white('[') + chalk.green('!') + chalk.white(']') + ` Information  => ` + chalk.yellow(`${info}\n`))
                var flow5 = getCookie.data.flow_token;
                var getCookie = await getFlow5(bearer, guesttoken, guestid, flow5, att, email);
                console.log(chalk.white('[') + chalk.green('!') + chalk.white(']') + ` Information  => ` + chalk.yellow(`${usernameAkun} | ${password} Successfully Get Cookie\n`))
                const csrf = await getCSRF(bearer, guestid, getCookie.auth_token);
                fs.appendFileSync("cookieAkunbaru.txt", getCookie.auth_token + "|" + csrf + "\n");
            } else {
                console.log(chalk.white('[') + chalk.green('!') + chalk.white(']') + ` Information  => ` + chalk.yellow(`${getCookie.data.subtasks[0].cta.secondary_text.text}\n`))
            }
        }
})();
