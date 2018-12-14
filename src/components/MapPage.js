import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router-dom'
import { graphql } from 'react-apollo'
import  { gql } from 'apollo-boost' 
import GoogleMapReact from 'google-map-react'
import { GMAP_KEY } from '../constant'

class MapPage extends Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 6,
  };
 
  render() {
    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: GMAP_KEY }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={ ({map, maps}) => 
            maps.event.addListener(map, 'click', function(e){   
              var infowindow = new window.google.maps.InfoWindow
              var geocoder = new window.google.maps.Geocoder
              var latlng = { lat: e.latLng.lat(), lng: e.latLng.lng() }
              geocoder.geocode( { 'location': latlng }, (result) => {
                if( result[0] ){
                  var i = 0
                  var locality = '', region = '', country = ''
                  while(i++ < result[0].address_components.length){
                      if( result[0].address_components[i] && (result[0].address_components[i].types[0] == ('locality')) )
                      locality = result[0].address_components[i].long_name
                      else if( result[0].address_components[i] && (result[0].address_components[i].types[0] == ('administrative_area_level_1')) )
                      region = result[0].address_components[i].long_name
                      else if( result[0].address_components[i] && (result[0].address_components[i].types[0] == ('country')) )
                      country = result[0].address_components[i].long_name
                  }
                  if( (locality || region || country) !== '' ){
                    infowindow.setContent( '<div><div><a href="/reviews/' + locality.split(' ').join('-') + '" style="color:black; text-decoration:none"> ' + locality + ' </div><div><a href="/reviews/' + region.split(' ').join('-') + '" style="color:black; text-decoration:none"> ' + region + ' </div><div><a href="/reviews/' + country.split(' ').join('-') + '" style="color:black; text-decoration:none"> ' + country + ' </div></div>' )
                    var marker = new window.google.maps.Marker({position: e.latLng, map: map})
                    infowindow.open(map,marker)
                  }
                }
              })
            })
          }
        >
        </GoogleMapReact>
      </div>
    )
  }
}
 
export default MapPage


/* const CREATE_DRAFT_MUTATION = gql`
  mutation CreateDraftMutation($title: String!, $text: String!) {
    createDraft(title: $title, text: $text) {
      id
      title
      text
    }
  }
`

const CreatePageWithMutation = graphql(CREATE_DRAFT_MUTATION, {
  name: 'createDraftMutation', // name of the injected prop: this.props.createDraftMutation...
})(CreatePage)

export default withRouter(CreatePageWithMutation) */
