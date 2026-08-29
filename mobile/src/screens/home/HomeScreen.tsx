import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image
} from 'react-native';
import { TripContext } from '../../context/TripContext';
import { AuthContext } from '../../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { trips, loading, fetchTrips } = React.useContext(TripContext);
  const { user } = React.useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTrips();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTrips();
    setRefreshing(false);
  };

  const renderTripCard = ({ item }) => {
    const daysRemaining = Math.ceil((new Date(item.endDate) - new Date()) / (1000 * 60 * 60 * 24));
    const isOngoing = new Date() >= new Date(item.startDate) && new Date() <= new Date(item.endDate);
    const isPast = new Date() > new Date(item.endDate);

    return (
      <TouchableOpacity
        style={styles.tripCard}
        onPress={() => navigation.navigate('TripDetails', { tripId: item._id })}
      >
        {item.coverImage && (
          <Image source={{ uri: item.coverImage }} style={styles.tripImage} />
        )}
        <View style={styles.tripCardContent}>
          <View style={styles.tripHeader}>
            <Text style={styles.tripName}>{item.name}</Text>
            <View style={[styles.statusBadge, isOngoing ? styles.ongoingBadge : isPast ? styles.pastBadge : styles.upcomingBadge]}>
              <Text style={styles.statusText}>
                {isOngoing ? 'Ongoing' : isPast ? 'Completed' : 'Upcoming'}
              </Text>
            </View>
          </View>

          <Text style={styles.destination}>
            📍 {item.destination?.place || 'Destination'}
          </Text>

          <View style={styles.tripDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Dates</Text>
              <Text style={styles.detailValue}>
                {new Date(item.startDate).toLocaleDateString('en-IN')}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Members</Text>
              <Text style={styles.detailValue}>{item.members.length}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Spent</Text>
              <Text style={styles.detailValue}>₹{item.totalSpent}</Text>
            </View>
          </View>

          {!isPast && (
            <Text style={styles.daysRemaining}>
              {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Ending today'}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome, {user?.name}! 👋</Text>
        <Text style={styles.subtitle}>Ready to track your trip expenses?</Text>
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CreateTrip')}
        >
          <Text style={styles.actionButtonIcon}>➕</Text>
          <Text style={styles.actionButtonText}>New Trip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('JoinTrip')}
        >
          <Text style={styles.actionButtonIcon}>🔗</Text>
          <Text style={styles.actionButtonText}>Join Trip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Chat')}
        >
          <Text style={styles.actionButtonIcon}>🤖</Text>
          <Text style={styles.actionButtonText}>Travel Buddy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tripsSection}>
        <Text style={styles.sectionTitle}>Your Trips</Text>

        {loading && !refreshing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
          </View>
        )}

        {trips && trips.length > 0 ? (
          <FlatList
            data={trips}
            renderItem={renderTripCard}
            keyExtractor={item => item._id}
            scrollEnabled={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>✈️</Text>
            <Text style={styles.emptyStateText}>No trips yet</Text>
            <Text style={styles.emptyStateSubtext}>Create your first trip to get started!</Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => navigation.navigate('CreateTrip')}
            >
              <Text style={styles.startButtonText}>Create First Trip</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8'
  },
  welcomeSection: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 10
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  actionButtonIcon: {
    fontSize: 24,
    marginBottom: 5
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333'
  },
  tripsSection: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  tripImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0'
  },
  tripCardContent: {
    padding: 15
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  tripName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20
  },
  ongoingBadge: {
    backgroundColor: '#FFE4B5'
  },
  pastBadge: {
    backgroundColor: '#E8E8E8'
  },
  upcomingBadge: {
    backgroundColor: '#D4F4DD'
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333'
  },
  destination: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  detailItem: {
    alignItems: 'center',
    flex: 1
  },
  detailLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 3
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333'
  },
  daysRemaining: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 10,
    fontWeight: '600'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40
  },
  emptyStateEmoji: {
    fontSize: 60,
    marginBottom: 15
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20
  },
  startButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  }
});

export default HomeScreen;
