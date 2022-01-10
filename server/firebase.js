var admin = require("firebase-admin");
const uuid = require("uuid");

admin.initializeApp({
	credential: admin.credential.cert({
		projectId: "uber-eats-clone-9bf88",
		privateKey:
			"-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCm/QE08HIlygPH\nNMYUcaNVWrvr7NN3chFZRdxP70vbfd0Q5qAilfYyveIQuDWoET1hfOfV2gglaHuB\nslI8Qg3b1K4cmy3lWFP9oKEEFttD7iRJWSsA7n0v06CLU39XAizlKkSIYB0VO006\nWmYMpa2j5uAmL2VNO+bRHhOfaHGClX7n5xlzUVaWoSx+H7e1he7aFUeJBq9Vf8B6\nPXyswtJlpCg8wP5m/FGsQY1w8btrEBMC2vHPPvuX2lpyg/gS5C+6609Y5itQZFek\ns1v7FcaIJQe57ss4XbyMbrvR4lRRqgkeD8C1DnK07aYpr5hjUN0m5GBvCNYDExQd\nittw4+kRAgMBAAECggEAKqzY3JsgSNkGOygZAQuDluIfyWzWJB3yIhLw+Tqp87eI\nQfP2c7BIYXJWbjhtefyh56Kgqu3UDB9WBPC6BG1LFmWVc3kS8xwuJtCgpadjtMoM\n2vPfQhcwxgK68jBOCEHlkFFLf2C0vgLQOzvz/YJvzEXJ/eg55tGKrOGXWTM7YwgA\nmO3rIROSuWgSH4Fa8sa04OUx0GcI3+qXbITao/zqqfR6Hsp2osCUnW2TkeOlwM2Q\nLxb7v+EODfRJywpCCZmol7qeH+Aj/Hl1n54LH7ycCf0VzLByVF5Rore8U5s806ND\nUFGinyhgaCRSBNvPndPx5qMQ6p9NDoT0cYRNepV1CwKBgQDeOKXz08sJ1kcND1nY\nU4CoypYagsfovFT23WmG/7mwtohoXHVizveEv6jdSxP62Y6pQmeyF1vW9SxIiHgE\nWH53QGWxocpfF0bqz2CLdDWbhJn3igEPL4/BNtBNogdKIyFa0eP4JQ3YCCK7q9/P\ndVwjOHVN4KlPAHf/j4jysIbhSwKBgQDAXw/OZk9Yh1uLOJSaLaL/KORAhslMjm4T\nCD0cLGl0fAv/ShDgYWUJXFtpJlwSkLSzsrDxAL7457OZbukMNYmdR9892xXWtuc9\nDSYzpT5H6JYYNSb/0X5mjs1FPbABij/4mLAyqJShXKKH2tyEgw9JvRRLWiYXaOxO\nGl2K42XBkwKBgQC/I1aKnRc9BNPkRdnvmhNGG8p0Tx0H8EXceKF1/quHddlqemx1\narO3uOrUPOmYkFyG9Zkfs7vI7uUCFm+0vTE5/Wf7G8Bnfiv/eBQAnxolBC8ynb8/\ngpdRh4Yv4DgI6qKb7YD6RVTdBlJpvfIqDTYNDVjIfX7jdvHAHYOby36YdQKBgQCx\nbLvqVMhn0WfoTwYX8XF9PxzOOsKcnlz9psKeIoQc0HBMQ+au3IVQjeMtZxjScq6H\nco7pqRN6BFHMeNPu084ZxvkqVs+cmlNKJr+OMKDxt53/s75FgdXAB4NhklSsBvOb\neFBCWOPEs+ifvodWnH5UN1TpbrrlKnuQSZbvC26FiwKBgQCkjbbGg1UxE3gFRQYs\no3aLKCVvs2akSd+58GPgEkSLkPXDmyg/pecPA4DQO8hcZ28yD51GGfRMEgMckV1Q\nSZVtk7UI1J7xfR5yWdHXFprq2Ou3hGtQ78e4MO78wS087FT9uuvAq4enegI59Wpe\n3nG3NjyoKNuG5KQaHj+cr6wtaw==\n-----END PRIVATE KEY-----\n",
		clientEmail:
			"firebase-adminsdk-mkwmz@uber-eats-clone-9bf88.iam.gserviceaccount.com",
	}),
	storageBucket: "uber-eats-clone-9bf88.appspot.com",
});
var bucket = admin.storage().bucket();

async function firebaseUploadFile(filename, path, cb) {
	const metadata = {
		metadata: {
			// This line is very important. It's to create a download token.
			firebaseStorageDownloadTokens: uuid(),
		},
		contentType: "image/png",
		cacheControl: "public, max-age=31536000",
	};

	// Uploads a local file to the bucket
	await bucket
		.upload(filename, {
			// Support for HTTP requests made with `Accept-Encoding: gzip`
			gzip: true,
			metadata: metadata,
			destination: path,
		})
		.then((file) => {
			return cb(file);
		});

	console.log(`${filename} uploaded.`);
}

async function firebaseDeleteFromFileName(filename) {
	await bucket.file(filename).delete();
}

exports.firebaseUploadFile = firebaseUploadFile;
exports.firebaseDeleteFromFileName = firebaseDeleteFromFileName;
