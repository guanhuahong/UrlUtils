(funcion (global, factory) {
    'use strict'
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = global.document ?
            factory (global, true) :
            function (w) {
                return factory(w)
            }
    } else {
        factory( global )
    }
}) ( typeof window !== 'undefined' ? window : this, function (window, noGlobal) {
'use strict'

function parseUrlParams(url) {
    url = url || window.location.href
    let pos = url.indexOf('?'),
        search = -1 === pos ? '' : url.substring(pos + 1).replace(/\+/g, '%20'),
        queryArr = search.split('&'),
        query = {}
    for(let len = queryArr.length, i = 0; i < len; i ++) {
        let keyValue = queryArr[i].split('='),
            key = decodeURIComponent(keyValue[0] || ''),
            value = decodeURIComponent(keyValue[1] || '')
        if (key && value) {
            if (undefined === query[key]) {
                query[key] = value
            } else {
                if ('object' === typeof query[key]) {
                    query[key].push(value)
                } else {
                    query[key] = [query[key], value]
                }
            }
        }
    }
    return query
}

function stringifyUrlParams(query) {
    let queryArr = []
    for(let key in query) {
        let value = query[key]
        if ('[object Array]' === Object.prototype.toString.call(value)) {
            for(let len = value.length, i = 0; i < len; i++) {
                if (null !== value[i] && undefined !== value[i]) {
                    queryArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(value[i]))
                }
            }
        } else {
            if (null !== value && undefined !== value) {
                queryArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
            }
        }
    }
    return queryArr.join('&')
}


function carete(url) {
    let len = arguments.length,
        pos = url.indexOf('?'),
        query = parseUrlParams(url)
    for(let i = 0; i < len; i++) {
        let arg = arguments[i]
        for( let key in arg) {
            query[key] = arg[key]
        }
    }
    return (-1 === pos ? url : url.substring(0, pos)) + '?' + stringifyUrlParams(query)
}

let url = {
    query: {
        parse: parseUrlParams,
        stringify: stringifyUrlParams
    },
    create: create
}

if (typeof define === 'function' && define.amd) {
    define('url', [], function() {
        return url
    })
}

if (!noGlobal) {
    window.url = url
}

}))
