import { mount } from '@vue/test-utils'
import { waitNT, waitRAF } from '../../../tests/utils'
import { BFormDate } from './form-date'
// import { formatYMD } from '../../utils/date'

// Note that JSDOM only supports `en-US` (`en`) locale for `Intl`

describe('form-date', () => {
  const originalCreateRange = document.createRange

  beforeEach(() => {
    // https://github.com/FezVrasta/popper.js/issues/478#issuecomment-407422016
    // Hack to make Popper not bork out during tests
    // Note popper still does not do any positioning calculation in JSDOM though
    // So we cannot test actual positioning of the menu, just detect when it is open
    document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document
      }
    })
  })

  afterEach(() => {
    // Reset overrides
    document.createRange = originalCreateRange
  })

  it('has expected base structure', async () => {
    const wrapper = mount(BFormDate, {
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

  it('reacts to changes in value', async () => {
    const wrapper = mount(BFormDate, {
      attachToDocument: true,
      propsData: {
        value: ''
      }
    })

    expect(wrapper.isVueInstance()).toBe(true)
    expect(wrapper.is('div')).toBe(true)
    await waitNT(wrapper.vm)
    await waitRAF()

    wrapper.setProps({
      value: '2020-01-20'
    })

    await waitNT(wrapper.vm)
    await waitRAF()

    // TBD

    wrapper.destroy()
  })
  it('focus and blur methods work', async () => {
    const wrapper = mount(BFormDate, {
      attachToDocument: true,
      propsData: {
        value: '',
        id: 'test-focus-blur'
      }
    })

    expect(wrapper.isVueInstance()).toBe(true)
    expect(wrapper.is('div')).toBe(true)
    await waitNT(wrapper.vm)
    await waitRAF()

    const $toggle = wrapper.find('button#test-focus-blur')

    expect($toggle.exists()).toBe(true)
    expect($toggle.is('button')).toBe(true)

    expect(document.activeElement).not.toBe($toggle.element)

    wrapper.vm.focus()
    await waitNT(wrapper.vm)
    await waitRAF()

    expect(document.activeElement).toBe($toggle.element)

    wrapper.vm.blur()
    await waitNT(wrapper.vm)
    await waitRAF()

    expect(document.activeElement).not.toBe($toggle.element)

    wrapper.destroy()
  })

  it('opens calendar when toggle button clicked', async () => {
    const wrapper = mount(BFormDate, {
      attachToDocument: true,
      propsData: {
        value: '',
        id: 'test-open'
      }
    })

    expect(wrapper.isVueInstance()).toBe(true)
    expect(wrapper.is('div')).toBe(true)
    await waitNT(wrapper.vm)
    await waitRAF()

    const $toggle = wrapper.find('button#test-open')

    expect($toggle.exists()).toBe(true)
    expect($toggle.is('button')).toBe(true)

    const $menu = wrapper.find('.dropdown-menu')

    expect($menu.exists()).toBe(true)
    expect($menu.classes()).not.toContain('show')

    $toggle.trigger('click')
    await waitNT(wrapper.vm)
    await waitRAF()
    await waitNT(wrapper.vm)
    await waitRAF()

    expect($menu.classes()).toContain('show')

    $toggle.trigger('click')
    await waitNT(wrapper.vm)
    await waitRAF()
    await waitNT(wrapper.vm)
    await waitRAF()

    expect($menu.classes()).not.toContain('show')

    wrapper.destroy()
  })

  it('emits new value when date updated', async () => {
    const wrapper = mount(BFormDate, {
      attachToDocument: true,
      propsData: {
        value: '',
        id: 'test-emit-input'
      }
    })

    expect(wrapper.isVueInstance()).toBe(true)
    expect(wrapper.is('div')).toBe(true)
    await waitNT(wrapper.vm)
    await waitRAF()

    expect(wrapper.emitted('input')).not.toBeDefined()

    const $toggle = wrapper.find('button#test-emit-input')
    const $menu = wrapper.find('.dropdown-menu')

    expect($toggle.exists()).toBe(true)
    expect($toggle.is('button')).toBe(true)
    expect($menu.exists()).toBe(true)
    expect($menu.classes()).not.toContain('show')
    expect(wrapper.find('.b-calendar').exists()).toBe(false)

    $toggle.trigger('click')
    await waitNT(wrapper.vm)
    await waitRAF()
    await waitNT(wrapper.vm)
    await waitRAF()

    expect($menu.classes()).toContain('show')
    expect(wrapper.find('.b-calendar').exists()).toBe(true)

    expect(wrapper.emitted('context')).toBeDefined()
    const lastIndex = wrapper.emitted('context').length - 1
    // activeYMD will be the date that caneldar has focused by default
    const activeYMD = wrapper.emitted('context')[lastIndex][0].activeYMD

    expect(activeYMD).not.toBe(null)
    expect(activeYMD).not.toBe('')
    expect(/^\d+-\d\d-\d\d$/.test(activeYMD)).toBe(true)

    const $grid = wrapper.find('[role="application"]')
    expect($grid.exists()).toBe(true)

    // Simulate picking todays date on calendar by keydown.enter on grid
    // The calendar has today's date as the default calendar day button
    $grid.trigger('keydown.enter')
    await waitNT(wrapper.vm)
    await waitRAF()
    await waitNT(wrapper.vm)
    await waitRAF()

    expect($menu.classes()).not.toContain('show')
    expect(wrapper.emitted('input')).toBeDefined()
    expect(wrapper.emitted('input').length).toBe(1)
    expect(wrapper.emitted('input')[0][0]).toBe(activeYMD)

    wrapper.destroy()
  })

  it('renders optional footer buttons', async () => {
    const wrapper = mount(BFormDate, {
      attachToDocument: true,
      propsData: {
        todayButton: true,
        resetButton: true,
        closeButton: true
      }
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
})
