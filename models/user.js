const { DataTypes } = require('sequelize')

module.exports = sequelize =>
	sequelize.define('User', {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		emailVerified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		verificationLink: {
			type: DataTypes.STRING,
			allowNull: true
		}
	})
