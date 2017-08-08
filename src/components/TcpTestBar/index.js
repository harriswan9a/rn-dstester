import React, {Component} from 'react';
import {Text, TextInput, View, Button, StyleSheet} from 'react-native';

var net = require('net');

import tcpp from 'tcp-ping';

export default class TcpTestBar extends Component {

    constructor(props) {
        super(props);
        const DEFAULT_DOMAIN = 'google.com';
        this.state = {text: DEFAULT_DOMAIN, result: ''};
    }

    render() {
        return (
            <View style={{flex: 1, flexDirection: 'column', padding: 5}}>
                <View style={{flexDirection: 'row'}}>
                    <TextInput
                        style={{flex:1, height: 40}}
                        placeholder="Type IP address or domain"
                        value={this.state.text}
                        onChangeText={(text) => {
                            this.setState({text})
                        }}
                    />
                    <Button
                        onPress={() => {
                            if (this.state.text) {
                                tcpp.ping({address: this.state.text}, (err, data) => {
                                    var result = JSON.stringify(data);
                                    console.log(result)
                                    this.setState({result: data})
                                })
                            }
                        }}
                        title="PING"
                        color="red"
                        accessibilityLabel="Learn more about this purple button"
                    />
                </View>
                <View style={{flex:1, flexDirection: 'column'}}>
                    <Text style={styles.infoText}>
                        Avg: {this.state.result.avg || 0} ms
                    </Text>
                    <Text style={styles.infoText}>
                        max: {this.state.result.max || 0} ms
                    </Text>
                    <Text style={styles.infoText}>
                        min: {this.state.result.min || 0} ms
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    infoText: {
        padding: 10,
        width: 260,
        fontSize: 16
    }
});