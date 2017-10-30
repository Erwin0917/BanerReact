const {resolve} = require("path");
const WebpackAssetsManifest = require("webpack-assets-manifest");



module.exports = {

	entry: "./js/src/adsBannerScript.jsx",
	output: {
		path: resolve(__dirname, "js/dist/"),
        filename: 'adsBannerScript-[hash].js',
        chunkFilename: 'adsBannerScript-[hash].js'
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
                    loader: 'babel-loader',
					options: {
						presets: [
							["env", {
							  "targets": {
								"browsers": ["last 3 versions"]
							  }
                            }],
                            'react'
						  ]
					}
				}
            },


		]
	},

	plugins: [
        new WebpackAssetsManifest()
	]

};