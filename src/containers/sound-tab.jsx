const React = require('react');
const bindAll = require('lodash.bindall');

const VM = require('scratch-vm');

const AssetPanel = require('../components/asset-panel/asset-panel.jsx');
const soundIcon = require('../components/asset-panel/icon--sound.svg');

const {connect} = require('react-redux');

const {
    openSoundLibrary
} = require('../reducers/modals');

class SoundTab extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleSelectSound',
            'handleDeleteSound'
        ]);
        this.state = {selectedSoundIndex: 0};
    }

    handleSelectSound (soundIndex) {
        const sound = this.props.vm.editingTarget.sprite.sounds[soundIndex];
        this.props.vm.editingTarget.audioPlayer.playSound(sound.md5);
        this.setState({selectedSoundIndex: soundIndex});
    }

    handleDeleteSound (soundIndex) {
        // @todo the VM should handle all of this logic
        const {editingTarget} = this.props.vm;
        editingTarget.sprite.sounds = editingTarget.sprite.sounds
            .slice(0, soundIndex)
            .concat(editingTarget.sprite.sounds.slice(soundIndex + 1));
        this.props.vm.emitTargetsUpdate();
        this.props.vm.runtime.requestRedraw();

        this.setState({
            selectedSoundIndex: this.state.selectedSoundIndex % editingTarget.sprite.sounds.length
        });
    }

    render () {
        const {
            vm,
            onNewSoundClick
        } = this.props;

        const sounds = vm.editingTarget ? vm.editingTarget.sprite.sounds.map(sound => (
            {
                image: soundIcon,
                name: sound.name
            }
        )) : [];


        return (
            <AssetPanel
                items={sounds}
                newText={'Add Sound'}
                selectedItemIndex={this.state.selectedSoundIndex}
                onDeleteClick={this.handleDeleteSound}
                onItemClick={this.handleSelectSound}
                onNewClick={onNewSoundClick}
            />
        );
    }
}

SoundTab.propTypes = {
    ...AssetPanel.propTypes,
    vm: React.PropTypes.instanceOf(VM)
};

const mapStateToProps = state => ({
    editingTarget: state.targets.editingTarget,
    sprites: state.targets.sprites,
    soundLibraryVisible: state.modals.soundLibrary
});

const mapDispatchToProps = dispatch => ({
    onNewSoundClick: e => {
        e.preventDefault();
        dispatch(openSoundLibrary());
    }
});

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(SoundTab);
