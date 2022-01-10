const localStatergy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
	const authenticateUser = async (email, password, done, token) => {
		const user = await getUserByEmail(email);
		console.log("inside config....>>", user);
		if (!user)
			return done(null, false, { message: "No user with this email" });
		try {
			const userPresent = await bcrypt.compare(password, user.password);
			if (userPresent) return done(null, user);
			else return done(null, false, { message: "Password Incorrect" });
		} catch (e) {
			return done(e);
		}
	};
	passport.use(
		new localStatergy({ usernameField: "email" }, authenticateUser)
	);
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	passport.deserializeUser((id, done) => {
		done(null, getUserById(id));
	});
}

module.exports = initialize;
