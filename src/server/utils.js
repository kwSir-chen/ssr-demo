import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, Route } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import { Helmet } from "react-helmet";

export const render = (store, routes, req, context) => {

		const content = renderToString((
			<Provider store={store}>
				<StaticRouter location={req.path} context={context}>
					<div>
						{renderRoutes(routes)}
	    		</div>
				</StaticRouter>
			</Provider>
		));
		const helmet = Helmet.renderStatic();

		const cssStr = context.css.length ? context.css.join('\n') : '';

		return `
			<html>
				<head>
					${helmet.title.toString()}
          ${helmet.meta.toString()}
					<style>${cssStr}</style>
				</head>
				<body>
					<div id="root">${content}</div>
					<script>
						window.context = {
							state: ${JSON.stringify(store.getState())}
						}
					</script>
					<script src='/index.js'></script>
				</body>
			</html>
	  `;
	
}

/**
 * 获取本地ip地址
 * 
 * param  os 
 * retrun ip
 */
export function getLocalIp(os) {
    let reg = new RegExp(/^(1[^2]\d)(\.\d{1,3}){3}/);
    let ip = '';
    let networkInterfaces = os.networkInterfaces()
    for (let key in networkInterfaces) {
        networkInterfaces[key].forEach(item => {
            if (reg.test(item.address)) {
                ip = item.address;
            }
        })
    }

    // 无网络时
    if (!ip) {
        ip = '127.0.0.1'
    }
    
    return ip
}