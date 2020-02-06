import { mount } from '@vue/test-utils'
import { waitNT, waitRAF } from '../../../tests/utils'
import { BCalendar } from './calendar'

//  Note that JSDOM only supports `en-US` (`en`) locale for Intl

describe('calendar', () => {
  it('has expected base structure', async () => {
    const wrapper = mount(BCalendar, {
      attachToDocument: true
    })

    expect(wrapper.isVueInstance()).toBe(true)
    expect(wrapper.is('div')).toBe(true)
    await waitNT(wrapper.vm)
    await waitRAF()

    // TBD

    await waitNT(wrapper.vm)
    await waitRAF()

    wrapper.destroy()
  })

  it('has expected structure when value is set', async () => {
    const wrapper = mount(BCalendar, {
      attachToDocument: true,
      propsData: {
        value: '2020-02-15' // Leap year
      }
    })

    expect(wrapper.isVueInstance()).toBe(true)
    await waitNT(wrapper.vm)
    await waitRAF()

    // TBD

    wrapper.destroy()
  })

  it('reacts to changes in value', async () => {
    const wrapper = mount(BCalendar, {
      attachToDocument: true,
      propsData: {
        value: '2020-01-01' // Leap year
      }
    })

    expect(wrapper.isVueInstance()).toBe(true)
    await waitNT(wrapper.vm)
    await waitRAF()

    // TBD

    wrapper.setProps({
      value: '2020-01-15'
    })
    await waitNT(wrapper.vm)
    await waitRAF()

    wrapper.destroy()
  })

  it('clicking a date selects date', async () => {
    const wrapper = mount(BCalendar, {
      attachToDocument: true,
      propsData: {
        value: '2020-01-01' // Leap year
      }
    })

    expect(wrapper.isVueInstance()).toBe(true)
    await waitNT(wrapper.vm)
    await waitRAF()

    const $grid = wrapper.find('[role="application"]')
    expect($grid.exists()).toBe(true)

    const $cell = wrapper.find('[data-date="2020-01-25"]')
    expect($cell.exists()).toBe(true)
    expect($cell.attributes('aria-selected')).not.toBeDefined()
    expect($cell.attributes('id')).toBeDefined()
    const $btn = $cell.find('.btn')
    expect($btn.exists()).toBe(true)
    expect($cell.attributes('id')).toBeDefined()
    expect($grid.attributes('aria-activedescendant')).toBeDefined()
    expect($grid.attributes('aria-activedescendant')).not.toEqual($cell.attributes('id'))

    $btn.trigger('click')
    await waitNT(wrapper.vm)
    await waitRAF()

    expect($cell.attributes('aria-selected')).toBeDefined()
    expect($cell.attributes('aria-selected')).toEqual('true')
    expect($grid.attributes('aria-activedescendant')).toEqual($cell.attributes('id'))

    wrapper.destroy()
  })

  it('date navigation buttons work', async () => {
    const wrapper = mount(BCalendar, {
      attachToDocument: true,
      propsData: {
        value: '2020-02-15' // Leap year
      }
    })

    expect(wrapper.isVueInstance()).toBe(true)
    await waitNT(wrapper.vm)
    await waitRAF()

    const $grid = wrapper.find('[role="application"]')
    expect($grid.exists()).toBe(true)
    expect($grid.attribute('data-month')).toBe('2020-02')

    const $navBtns = wrapper.findAll('.b-calendar-nav button')
    expect($navBtns.length).toBe(5)

    // Prev Month
    $navBtns.at(1).trigger('click')
    await waitNT(wrapper.vm)
    await waitRAF()
    expect($grid.attribute('data-month')).toBe('2020-01')

    // Next Month
    $navBtns.at(3).trigger('click')
    await waitNT(wrapper.vm)
    await waitRAF()
    expect($grid.attribute('data-month')).toBe('2020-02')

    // Prev Year
    $navBtns.at(0).trigger('click')
    await waitNT(wrapper.vm)
    await waitRAF()
    expect($grid.attribute('data-month')).toBe('2019-02')

    // Next Year
    $navBtns.at(4).trigger('click')
    await waitNT(wrapper.vm)
    await waitRAF()
    expect($grid.attribute('data-month')).toBe('2020-02')

    // Current Month
    // Handle the rare case this test is run right at midnight where
    // the current month rolled over at midnight
    const thisMonth1 = formatYMD(new date()).slice(0, -3)
    $navBtns.at(2).trigger('click')
    await waitNT(wrapper.vm)
    await waitRAF()
    const thisMonth2 = formatYMD(new date()).slice(0, -3)
    const thisMonth = $grid.attribute('data-month')
    expect(thisMonth === thisMonth1 || thisMonth === thisMonth2).toBe(true)

    wrapper.destroy()
  })

  it('focus snd blur methods work', async () => {
    const wrapper = mount(BCalendar, {
      attachToDocument: true,
      propsData: {
        value: '2020-02-15' // Leap year
      }
    })

    expect(wrapper.isVueInstance()).toBe(true)
    await waitNT(wrapper.vm)
    await waitRAF()

    const $grid = wrapper.find('[role="application"]')
    expect($grid.exists()).toBe(true)
    expect($grid.is('div')).toBe(true)

    expect(document.activeElement).not.toBe($grid.element)

    wrapper.vm.focus()
    await waitNT(wrapper.vm)
    await waitRAF()

    expect(document.activeElement).toBe($grid.element)

    wrapper.vm.blur()
    await waitNT(wrapper.vm)
    await waitRAF()

    expect(document.activeElement).not.toBe($grid.element)

    wrapper.destroy()
  })

  it('keyboard navigation works', async () => {
    const wrapper = mount(BCalendar, {
      attachToDocument: true,
      propsData: {
        value: '2020-02-15' // Leap year
      }
    })

    expect(wrapper.isVueInstance()).toBe(true)
    await waitNT(wrapper.vm)
    await waitRAF()

    // TBD

    wrapper.destroy()
  })
})
