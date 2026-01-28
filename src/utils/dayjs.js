/**
 * DEPENDENCY OPTIMIZATION: moment → dayjs migration
 * 
 * This file provides dayjs with timezone support as a lightweight replacement for moment-timezone.
 * dayjs is ~2KB vs moment's ~70KB, significantly reducing bundle size.
 * 
 * Usage:
 * - import dayjs from '../utils/dayjs' (or adjust path as needed)
 * - dayjs().format('DD-MM-YYYY')
 * - dayjs().fromNow()
 * - dayjs.tz(date, 'Europe/London').format()
 * - dayjs().diff(dayjs(otherDate), 'days')
 */

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

// Set default timezone to Europe/London (matching existing moment-timezone usage)
dayjs.tz.setDefault('Europe/London');

export default dayjs;

/**
 * Compatibility shim for moment-timezone patterns used in the codebase:
 * 
 * Before (moment):
 *   moment.tz(date, 'Europe/London').fromNow()
 *   moment.tz(date, 'Europe/London').format('YYYY-MM-DD HH:mm:ss')
 *   moment().diff(moment(date), 'days')
 *   moment(date).format('DD-MM-YYYY')
 *   moment(date).format('HH:mm')
 *   moment(date).format('ddd D, MMMM')
 * 
 * After (dayjs):
 *   dayjs.tz(date, 'Europe/London').fromNow()
 *   dayjs.tz(date, 'Europe/London').format('YYYY-MM-DD HH:mm:ss')
 *   dayjs().diff(dayjs(date), 'day')
 *   dayjs(date).format('DD-MM-YYYY')
 *   dayjs(date).format('HH:mm')
 *   dayjs(date).format('ddd D, MMMM')
 * 
 * Key differences:
 * - dayjs.diff() uses singular unit names ('day' vs 'days')
 * - Timezone support requires explicit plugin extension (already done above)
 */