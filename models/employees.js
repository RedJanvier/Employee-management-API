const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database').conn;

const Employee = db.define('employee', {
  uuid: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please enter your name'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull:false,
    validate: {
      isIn: {
        args: [['active', 'inactive']],
        msg: "Must be Active or Inactive"
      }
    }
  },
  nid: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
    validate: {
      len: [16, 16]
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^(25)?0?7[3 2 8]{1}[0-9]{7}$/
    }
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['manager', 'developer', 'designer']],
        msg: 'Position must be a Manager, Developer or Designer'
      }
    }
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true
    }
  }
});

module.exports = Employee;