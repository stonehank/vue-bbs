import AV from "./CustomAV";
// window.CustomAV=AV
export default function initAVObject($serverLessBBS) {
    let {appId, appKey,serverURLs} = $serverLessBBS
    if(AV.__appKey__ && AV.__appId__) return Promise.resolve()
    return __initServerURLs__(appId,serverURLs)
    .then((serverURLs) => {
        if (!serverURLs) {
            throw new Error('serverURLs 获取失败，请自行手动添加, https://github.com/stonehank/react-valine#获取serverURLs')
        }
        try {
            AV.init({
                appId: appId,
                appKey: appKey,
                serverURLs: serverURLs
            })
            // if(editMode)AV.User.logOut()
        } catch (e) {
            console.error(e)
            throw new Error('Something error when initial leancloud, try again please')
            // do nothing
        }
    })
}
function __initServerURLs__(appId,serverURLs) {
    return new Promise(res => {
        if (!serverURLs) {
            return __getServerURLs__(appId).then((url) => res(url))
        } else {
            return res(serverURLs)
        }
    })
    .then((urls) => {
        let serverURLs = urls
        if (typeof serverURLs === 'string' && !serverURLs.startsWith('https://')) {
            serverURLs = 'https://' + serverURLs
        }
        return serverURLs
    })
    .catch((err) => {
        console.error(err)
        throw new Error('Something error happened in initial server urls. Please pass the serverURLs manually')
    })
}

function __getServerURLs__(appId) {
    return fetch('https://app-router.leancloud.cn/2/route?appId=' + appId, {
        method: 'get',
    }).then(data => data.json())
    .then(resp => {
        return resp.api_server || resp.api
    })
}

