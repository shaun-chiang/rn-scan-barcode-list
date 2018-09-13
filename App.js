import React from "react"
import { StyleSheet, Text, View, Button, FlatList } from "react-native"
import { BarCodeScanner, Permissions } from "expo"

export default class BarcodeScannerExample extends React.Component {
  state = {
    hasCameraPermission: null,
    barcodesScanned: null
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermission: status === "granted",
      barcodesScanned: ""
    })
  }

  getBarcodesScanned() {
    if (this.state.barcodesScanned.length === 0) {
      return <Text>Scan a barcode to begin!</Text>
    } else {
      return <Text selectable={true}>{this.state.barcodesScanned}</Text>
    }
  }

  handleResetButton() {
    this.setState({
      barcodesScanned: ""
    })
  }

  render() {
    const { hasCameraPermission } = this.state

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>
    } else {
      return (
        <View style={{ flex: 1 }}>
          <BarCodeScanner
            onBarCodeRead={this._handleBarCodeRead}
            style={{ flex: 1 }}
          />
          {this.getBarcodesScanned()}
          <Button onPress={() => this.handleResetButton()} title={"Reset"} />
        </View>
      )
    }
  }

  _handleBarCodeRead = ({ type, data }) => {
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`)
    if (
      !this.state.barcodesScanned.includes(data) &&
      data.match(/^[STFG]\d{7}[A-Z]$/)
    ) {
      this.setState({
        barcodesScanned: this.state.barcodesScanned + data + "\n"
      })
    }
  }
}
