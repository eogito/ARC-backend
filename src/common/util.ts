import { NotAcceptableException } from '@nestjs/common'

import * as moment from "moment-timezone"
import * as crypto from 'crypto'
import {ErrorCodes} from "./constants/error-code"
import {ServerConfig} from "./config/configure"
export default {

  generateHashPassword(password: string): string {
    const hmac = crypto.createHmac('sha1', process.env.PASSWORD_SALT)
    hmac.update(password)
    const hash= hmac.digest('hex')
    return hash
  },

  getErrorMessage(errorCode: string): string {
    return ErrorCodes[errorCode]
  },

  throwError(errorCode: string, status = 400) {
    const message = this.getErrorMessage(errorCode)
    throw new NotAcceptableException({
      status: status,
      message: message,
      errorCode: errorCode
    })
  },

  strToNumber(value: any) {
    if ((typeof value === 'string' || value instanceof String) && value !== '') {
      return Number(value)
    } else {
      return value
    }
  },

  rawQueryJson(results: any) {
    results = JSON.stringify(
      results,
      (key, value) => (typeof value === 'bigint' ? parseInt(value.toString()) : value)
    )
    return results
  },

  trimStr: function(val: any) {
    if ((typeof val === 'string' || val instanceof String ) && val !== '') {
      return val.trim()
    } else {
      return val
    }
  },

  trimDayStr: function(val: any) {
    if ((typeof val === 'string' || val instanceof String ) && val !== '') {
      const dateString = val.trim()
      if (dateString) {
        return dateString.slice(0, 10)
      }
    } else {
      return val
    }
  },

  convertToNumber: function(val: any) {
    if ((typeof val === 'string' || val instanceof String ) && val !== '') {
      return Number(val.trim())
    } else {
      return val
    }
  },
  getDateTimeStampValue: function (dt: any) {
    return moment(dt).tz(ServerConfig['TIMEZONE']).format('YYYY-MM-DD HH:mm:ss')
  },
  formatDateTimeStampField: function(val: any, field) {
    if (val) {
      return this.getDateTimeStampValue(val)
    } else {
      return val
    }
  },
  shortFormatDateTimeField: function (val: any) {
    if (val) {
      const dt = new Date(val)
      return moment(dt).tz(ServerConfig['TIMEZONE']).format('YYYY-MM-DD')
    }
  },
  shortDateTimeObj: function (obj: object) {
    if (obj.hasOwnProperty('createdAt') && obj['createdAt'] !== null) {
      obj['createdAt'] = this.shortFormatDateTimeField(obj['createdAt'])
    }
    if (obj.hasOwnProperty('updatedAt') && obj['updatedAt'] !== null) {
      obj['updatedAt'] = this.shortFormatDateTimeField(obj['updatedAt'])
    }
  },
  getPeriodShiftdays: function(startDate, endDate, weekDayStr, totalDays) {
    const nextMondays = []
    const currentDate = moment.tz(startDate, ServerConfig['TIMEZONE'])
    // Find the next Monday = 1
    let weekDay = null
    switch (weekDayStr) {
      case 'Monday':
        weekDay = 1
        break
      case 'Tuesday':
        weekDay = 2
        break
      case 'Wednesday':
        weekDay = 3
        break
      case 'Thursday':
        weekDay = 4
        break
      case 'Friday':
        weekDay = 5
        break
      case 'Saturday':
        weekDay = 6
        break
      case 'Sunday':
        weekDay = 0
        break
    }
    while (currentDate.day() !== weekDay) {
      currentDate.add(1, 'day')
    }
    // Generate next 100 Mondays
    for (let i = 0; i < totalDays; i++) {
      const tempDate = currentDate.format('YYYY-MM-DD')
      if (tempDate <= endDate) {
        nextMondays.push(tempDate)
        currentDate.add(7, 'days')
      }
    }
    return nextMondays
  }
}