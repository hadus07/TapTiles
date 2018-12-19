import React from 'react'
import { 
  View,
  Text,
  Button,
  Vibration,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  TouchableOpacity,
} from 'react-native'

const Overlay = () => (
  <View style={styles.overlay}>
    <View style={styles.bar}/>
    <View style={styles.bar}/>
    <View style={styles.bar}/>
    <View style={styles.bar}/>
    <View style={styles.bar}/>
  </View>
)

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height
const tilePosition = [0, screenWidth/4, screenWidth/2, screenWidth/4*3]

class Tile extends React.Component {
  state = {
    top: -200,
    killed: false,
    left: tilePosition[0],
    sound: require('./assets/tap.mp3')
  }
  componentDidMount = async () => {
    this.setState({left: tilePosition[Math.floor(Math.random() * 4)]})
    let positionerInterval = setInterval(() => {
      if(this.state.top <= screenHeight) {
        this.setState({top: this.state.top + 10})
      }else if(!this.state.killed) {
        this.props.onGameOver()
        clearInterval(this.state.intervalId)
      }
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    }, 15)
    this.setState({intervalId: positionerInterval})
  }
  render() {
    return this.state.killed ? null : (
      <TouchableOpacity
      onPress={() => {
        Vibration.vibrate(200)
        this.setState({killed: true}, this.props.onPress)}
      }
      style={[styles.tile, {marginTop: this.state.top, marginLeft: this.state.left}]}
      />
    )
  }
}

export default class App extends React.Component {
  counter = 0
  state = {gameOver: false, tiles: [], intervalId: null, success: 0}
  componentDidMount = () => console.disableYellowBox = true
  componentWillUnmount = () => clearTimeout(this.state.intervalId)
  start = () => {
    let spitterInterval = setInterval(() => {
      this.setState({tiles: [...this.state.tiles, ++this.counter]})
    }, 400)
    this.setState({intervalId: spitterInterval})
  }
  render() {
    return this.state.gameOver ? (
      <View style={styles.over}>
        <Text style={styles.overText}>Game Over</Text>
        <Text style={[styles.overText, {fontSize: 30}]}>Score: {this.state.success}</Text>
        <Button title="Restart" onPress={() => this.setState({gameOver: false})} />
      </View>
    ) : (
      <View style={styles.container}>
        <Overlay />
        {this.state.tiles.length === 0 ? (
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.start}
            onPress={() => this.setState({success: 0}, this.start)}
          >
            <Text style={styles.startText}>Start</Text>
          </TouchableOpacity>
        ) : (
          this.state.tiles.map(i => (
            <Tile 
              key={i}
              onPress={() => this.setState({success: this.state.success+1})}
              onGameOver={() => {
                this.counter = 0
                clearInterval(this.state.intervalId)
                this.setState({tiles: [], gameOver: true})
              }}
            />
          ))
        )}
        <View style={styles.counter}>
          <Text style={styles.counterText}>{this.state.success}</Text>
        </View>
      </View>
    )
  }
}

const shadow = {
  elevation: 10,
  shadowRadius: 6,
  shadowOpacity: 0.4,
  shadowColor: "#000",
  shadowOffset: {width: 0, height: 5},
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bar: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
  },  
  tile: {
    height: 200,
    position: 'absolute',
    width: screenWidth/4,
    backgroundColor: '#000',
  },
  over: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overText: {
    fontSize: 50,
    color: '#444',
    fontWeight: '700',
    marginBottom: 100,
    textAlign: 'center',
  },
  start: {
    ...shadow,
    bottom: 200,
    left: screenWidth/4,
    position: 'absolute',
    alignItems: 'center',
    width: screenWidth/2,
    height: screenWidth/2,
    backgroundColor: '#000',
    justifyContent: 'center',
    borderRadius: screenWidth/4,
  },
  startText: {
    fontSize: 30,
    color: 'white',
    fontWeight: '700',
  },
  counter: {
    top: 50,
    ...shadow,
    width: screenWidth/6,
    alignItems: 'center',
    position: 'absolute',
    height: screenWidth/6,
    left: screenWidth*5/12,
    backgroundColor: '#000',
    justifyContent: 'center',
    borderRadius: screenWidth/12,
  },
  counterText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
  }
})
