import * as React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import Routes from './Routes'
import Login from '-/pages/login/Login'
import UserLayout from '-/layouts/user/UserLayout'
import PageNotFound from '-/pages/pageNotFound'

const renderRoutes = path => mount(
  <MemoryRouter initialEntries={[path]}>
    {/* <Provider store={configureStore()}> */}
    <Routes />
    {/* </Provider> */}
  </MemoryRouter>,
)
describe('Test <App />', () => {
  it('valid path should not redirect to 404 page', () => {
    const wrapper = renderRoutes('/user/')
    expect(wrapper.find(UserLayout)).toHaveLength(1)
    expect(wrapper.find(PageNotFound)).toHaveLength(0)
  })
  it('invalid path should redirect to 404 page', () => {
    const wrapper = renderRoutes('/404')
    expect(wrapper.find(Login)).toHaveLength(0)
    expect(wrapper.find(PageNotFound)).toHaveLength(1)
  })
  it('"/antd path" should render antd page', () => {
    const wrapper = renderRoutes('/user/login')
    expect(wrapper.find(Login)).toHaveLength(1)
    expect(wrapper.find(PageNotFound)).toHaveLength(0)
  })
})
